const fileInput = document.querySelector('#fileInput');
const dropZone = document.querySelector('#dropZone');
const preview = document.querySelector('#preview');
const clearButton = document.querySelector('#clearButton');
const emptyState = document.querySelector('#emptyState');
const resultText = document.querySelector('#resultText');
const loader = document.querySelector('#loader');
const status = document.querySelector('#status');
const copyButton = document.querySelector('#copyButton');
const downloadButton = document.querySelector('#downloadButton');
const toast = document.querySelector('#toast');

const sampleText = 'امروز یاد گرفتم که هر ایده‌ی بزرگ، از یک یادداشت کوچک شروع می‌شود.\n\nمهم این است که بنویسیم، تجربه کنیم و از ساختن نترسیم.';

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2200);
}

function resetWorkspace() {
  fileInput.value = '';
  preview.removeAttribute('src');
  dropZone.classList.remove('has-image');
  loader.style.display = 'none';
  resultText.style.display = 'none';
  resultText.value = '';
  emptyState.style.display = 'flex';
  status.innerHTML = '<i></i> آماده';
  copyButton.disabled = true;
  downloadButton.disabled = true;
}

function processFile(file) {
  if (!file || !file.type.startsWith('image/')) {
    showToast('لطفاً یک فایل تصویری انتخاب کنید');
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    showToast('حجم تصویر بیشتر از ۱۰ مگابایت است');
    return;
  }

  preview.src = URL.createObjectURL(file);
  dropZone.classList.add('has-image');
  emptyState.style.display = 'none';
  resultText.style.display = 'none';
  loader.style.display = 'flex';
  status.innerHTML = '<i></i> در حال پردازش';

  window.setTimeout(() => {
    loader.style.display = 'none';
    resultText.value = sampleText;
    resultText.style.display = 'block';
    status.innerHTML = '<i></i> انجام شد';
    copyButton.disabled = false;
    downloadButton.disabled = false;
  }, 1600);
}

dropZone.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => processFile(fileInput.files[0]));
clearButton.addEventListener('click', resetWorkspace);

['dragenter', 'dragover'].forEach((eventName) => dropZone.addEventListener(eventName, (event) => {
  event.preventDefault();
  dropZone.classList.add('dragging');
}));
['dragleave', 'drop'].forEach((eventName) => dropZone.addEventListener(eventName, (event) => {
  event.preventDefault();
  dropZone.classList.remove('dragging');
}));
dropZone.addEventListener('drop', (event) => processFile(event.dataTransfer.files[0]));

copyButton.addEventListener('click', async () => {
  await navigator.clipboard.writeText(resultText.value);
  showToast('متن کپی شد ✓');
});

downloadButton.addEventListener('click', () => {
  const blob = new Blob([resultText.value], { type: 'text/plain;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'dastnevis-transcript.txt';
  link.click();
  URL.revokeObjectURL(link.href);
  showToast('فایل متن دانلود شد');
});
