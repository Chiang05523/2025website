const emailInput = document.getElementById('email');
const emailError = document.getElementById('emailError');
const submitBtn = document.getElementById('submitBtn');
const feedbackForm = document.getElementById('feedbackForm');

// 郵件格式檢查函數
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// 監聽輸入事件
emailInput.addEventListener('input', () => {
  const value = emailInput.value;
  
  if (value === "") {
    // 若為空，隱藏錯誤但不通過
    emailError.style.display = 'none';
    emailInput.classList.remove('invalid');
    submitBtn.disabled = true;
  } else if (validateEmail(value)) {
    // 格式正確
    emailError.style.display = 'none';
    emailInput.classList.remove('invalid');
    submitBtn.disabled = false;
  } else {
    // 格式錯誤
    emailError.style.display = 'block';
    emailInput.classList.add('invalid');
    submitBtn.disabled = true;
  }
});

// 攔截表單送出（示範用）
feedbackForm.addEventListener('submit', (e) => {
  e.preventDefault();
  alert('表單驗證成功，正在送出回饋！');
});