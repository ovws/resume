const editButton = document.querySelector(".edit")
const updateTime = document.querySelector("#updateTime")

if (updateTime) {
  updateTime.textContent = "2026-08-12"
}

if (editButton) {
  editButton.addEventListener("click", () => {
    const isEditing = document.designMode === "on"
    document.designMode = isEditing ? "off" : "on"
    editButton.classList.toggle("on-edit", !isEditing)
    editButton.textContent = isEditing ? "编辑页面" : "退出编辑"
  })
}
