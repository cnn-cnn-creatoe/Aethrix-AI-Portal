import os

root = "."
limit = 50 * 1024 * 1024 # 50MB

print("Searching for files larger than 50MB...")
for dirpath, dirnames, filenames in os.walk(root):
    # Skip .git directory
    if '.git' in dirpath:
        continue
        
    for f in filenames:
        fp = os.path.join(dirpath, f)
        try:
            size = os.path.getsize(fp)
            if size > limit:
                print(f"[LARGE] {size/1024/1024:.2f} MB: {fp}")
        except Exception as e:
            pass
print("Search complete.")
