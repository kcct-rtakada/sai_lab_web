export default function getUsingPhone() {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}