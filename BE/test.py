
import os
os.environ['TL_BACKEND'] = 'tensorflow'  # Thêm dòng này ở đầu file, trước mọi import
os.environ['TL_DATA_FORMAT'] = 'channels_last'


from srgan import SRGAN_g
import tensorlayerx as tlx
import numpy as np
import cv2

G = SRGAN_g()
G.init_build(tlx.nn.Input(shape=(8, 96, 96, 3)))  # Thay đổi shape từ (8,3,96,96) thành (8,96,96,3)

checkpoint_dir = "models"
test_dir = "test/output"

def debug_image_data(img, name="Image"):
    """Debug helper function"""
    print(f"\n{name} debug info:")
    print(f"Type: {type(img)}")
    if isinstance(img, np.ndarray):
        print(f"Shape: {img.shape}")
        print(f"Dtype: {img.dtype}")
        print(f"Min value: {img.min()}")
        print(f"Max value: {img.max()}")
    else:
        print("Not a numpy array")

def create_blending_mask(shape):
    """Tạo mask để blend các patches"""
    h, w = shape
    mask = np.ones((h, w), dtype=np.float32)
    
    # Tạo gradient ở các cạnh
    gradient_size = 32
    for i in range(gradient_size):
        alpha = i / gradient_size
        mask[i, :] *= alpha
        mask[-i-1, :] *= alpha
        mask[:, i] *= alpha
        mask[:, -i-1] *= alpha
    
    return mask[..., np.newaxis]

def process_image_patches(G, lr_img, patch_size=384, overlap=32):
    h, w = lr_img.shape[:2]
    
    n_h = (h + patch_size - 1) // patch_size
    n_w = (w + patch_size - 1) // patch_size
    
    print(f"Splitting image {(h, w)} into {n_h}x{n_w} patches")
    
    scale = 4
    output = np.zeros((h * scale, w * scale, 3), dtype=np.float32)
    weight = np.zeros_like(output)
    
    for i in range(n_h):
        for j in range(n_w):
            top = i * patch_size
            left = j * patch_size
            bottom = min(top + patch_size + overlap, h)
            right = min(left + patch_size + overlap, w)
            
            patch = lr_img[top:bottom, left:right]
            
            # Thay đổi cách chuẩn bị tensor cho format NHWC
            patch_tensor = (patch / 127.5) - 1
            # Chỉ thêm batch dimension, không chuyển CHW
            patch_tensor = patch_tensor[np.newaxis, ...]
            patch_tensor = tlx.ops.convert_to_tensor(patch_tensor.astype(np.float32))
            
            try:
                sr_patch = G(patch_tensor)
                sr_patch = tlx.ops.convert_to_numpy(sr_patch)
                
                # Chuyển về khoảng [0, 1]
                sr_patch = (sr_patch + 1) / 2
                # Bỏ batch dimension, không cần transpose nữa vì đã ở format HWC
                sr_patch = sr_patch[0]
                
                top_sr = top * scale
                left_sr = left * scale
                bottom_sr = bottom * scale
                right_sr = right * scale
                
                mask = np.ones_like(sr_patch)
                if overlap > 0:
                    mask = create_blending_mask(sr_patch.shape[:2])
                
                output[top_sr:bottom_sr, left_sr:right_sr] += sr_patch * mask
                weight[top_sr:bottom_sr, left_sr:right_sr] += mask
                
                print(f"Processed patch ({i}, {j})")
                
            except Exception as e:
                print(f"Error processing patch ({i}, {j}): {str(e)}")
                continue
    
    output = np.divide(output, weight, where=weight != 0)
    output = np.clip(output * 255, 0, 255).astype(np.uint8)
    debug_image_data(output, "Output image")
    
    return output

def test(test_img_path):
    ###====================== PRE-LOAD DATA ===========================###
    test_lr_imgs = tlx.vision.load_images(path=test_img_path)
    ###========================LOAD WEIGHTS ============================###
    G.load_weights(os.path.join(checkpoint_dir, 'g.npz'), format='npz_dict')
    G.set_eval()
    
    imid = 0
    valid_lr_img = test_lr_imgs[imid]
    
    # Đảm bảo valid_lr_img là numpy array
    if not isinstance(valid_lr_img, np.ndarray):
        valid_lr_img = np.array(valid_lr_img)
    
    print("Starting image processing with patches...")
    print(f"Input image shape: {valid_lr_img.shape}")
    
    try:
        # Process image using patches
        sr_img = process_image_patches(G, valid_lr_img, patch_size=384, overlap=32)
        
        print(f"SR image generated with shape: {sr_img.shape}")
        
        # Save results
        os.makedirs(test_dir, exist_ok=True)
        
        # Đảm bảo sr_img là numpy array
        if not isinstance(sr_img, np.ndarray):
            sr_img = np.array(sr_img)
            
        # Đảm bảo valid_lr_img là numpy array với dtype đúng
        if not isinstance(valid_lr_img, np.ndarray):
            valid_lr_img = np.array(valid_lr_img)
        if valid_lr_img.dtype != np.uint8:
            valid_lr_img = valid_lr_img.astype(np.uint8)
        
        # Save SR image
        try:
            sr_img_bgr = cv2.cvtColor(sr_img, cv2.COLOR_RGB2BGR)
            cv2.imwrite(os.path.join(test_dir, 'valid_gen.png'), sr_img_bgr)
            print("Saved SR image")
        except Exception as e:
            print(f"Error saving SR image: {str(e)}")
        
        # Save LR image
        try:
            lr_img_bgr = cv2.cvtColor(valid_lr_img, cv2.COLOR_RGB2BGR)
            cv2.imwrite(os.path.join(test_dir, 'valid_lr.png'), lr_img_bgr)
            print("Saved LR image")
        except Exception as e:
            print(f"Error saving LR image: {str(e)}")
        
        print(f"[*] Images saved to {test_dir}")
        
    except Exception as e:
        print(f"Error during processing: {str(e)}")
        raise
    finally:
        # Cleanup
        import gc
        gc.collect()
       
if __name__ == '__main__':
    test(test_img_path="test/input") 