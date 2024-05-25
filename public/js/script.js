// Handles the classification selection for each inventory item
function handleClassificationSelect() {
    const classificationSelect  = document.getElementsByClassName('carClass');
    const selectedClassification = '<%= classification_id %>';
    if (selectedClassification) {
        classificationSelect.value = selectedClassification;
    }
}

module.exports = { handleClassificationSelect };