import re

path = r"d:\KMCT\Projects\KSBM\frontend\src\features\admin\cms\ManageAdmissionsPage.jsx"

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add import useDeferredUpload
if "useDeferredUpload" not in content:
    content = content.replace(
        'import AddItemModal from "./components/AddItemModal";',
        'import AddItemModal from "./components/AddItemModal";\nimport { useDeferredUpload } from "../../../hooks/useDeferredUpload";'
    )

# 2. Add hook state and pendingFiles
if "const { markForDeletion" not in content:
    content = content.replace(
        'const [modalConfig, setModalConfig] = useState({ isOpen: false, title: "", fields: [], initialData: null, onSave: () => {} });',
        'const [modalConfig, setModalConfig] = useState({ isOpen: false, title: "", fields: [], initialData: null, onSave: () => {} });\n  const { markForDeletion, uploadFile, executeDeletions, clearDeletions } = useDeferredUpload();\n  const [pendingFiles, setPendingFiles] = useState({});'
    )

# 3. Add handleImageChange
handle_img_change_str = """  const handleImageChange = (field, url, file) => {
    const oldUrl = formData[field];
    if (oldUrl && !oldUrl.startsWith('blob:') && oldUrl !== url) {
      markForDeletion(oldUrl);
    }
    handleChange(field, url);
    setPendingFiles(prev => {
      const next = { ...prev };
      if (file) next[field] = file;
      else delete next[field];
      return next;
    });
  };

  const handleChange ="""

if "handleImageChange = (field, url, file)" not in content:
    content = content.replace("  const handleChange =", handle_img_change_str)

# 4. Modify handleSave
# I need to change:
#     await api.put("/cms/admissions-page", formData, { hideLoader: true });
# to:
#     const finalData = { ...formData };
#     for (const key of Object.keys(pendingFiles)) {
#       finalData[key] = await uploadFile(pendingFiles[key], '/upload/admissions');
#     }
#     await api.put("/cms/admissions-page", finalData, { hideLoader: true });
#     await executeDeletions();
#     setFormData(finalData);
#     setPendingFiles({});

new_save_logic = """          const finalData = { ...formData };
          for (const key of Object.keys(pendingFiles)) {
            finalData[key] = await uploadFile(pendingFiles[key], '/upload/admissions');
          }
          await api.put("/cms/admissions-page", finalData, { hideLoader: true });
          await executeDeletions();
          setFormData(finalData);
          setPendingFiles({});"""

if "const finalData = { ...formData };" not in content:
    content = content.replace(
        'await api.put("/cms/admissions-page", formData, { hideLoader: true });',
        new_save_logic
    )

# 5. Modify handleResetToDefault to clear deletions
if "clearDeletions();" not in content:
    content = content.replace(
        'Toast.fire({ icon: "info", title: "Settings reset to default. Click Save Changes to apply." });',
        'clearDeletions();\n        setPendingFiles({});\n        Toast.fire({ icon: "info", title: "Settings reset to default. Click Save Changes to apply." });'
    )

# 6. Change all onChange handlers and deferredMode in LogoUploader
content = re.sub(
    r'onChange=\{\(url\) => handleChange\("([a-zA-Z0-9_]+)", url\)\}',
    r'onChange={(url, file) => handleImageChange("\1", url, file)}',
    content
)

content = content.replace('deferredMode={false}', 'deferredMode={true}')

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("Done")
