/**
 * Decode Base64 ID từ backend C#
 * Backend sử dụng: Convert.ToBase64String(BitConverter.GetBytes(int))
 * Dữ liệu ở định dạng little-endian 4 byte
 */

/**
 * Giải mã một chuỗi Base64 thành số nguyên
 * @param {string} base64String - Chuỗi Base64 cần giải mã
 * @returns {number|null} - Số nguyên đã giải mã hoặc null nếu lỗi
 */
const decodeSingleBase64Id = (base64String) => {
  try {
    // Kiểm tra đầu vào
    if (!base64String || typeof base64String !== 'string') {
      return null;
    }

    // Giải mã Base64 thành Uint8Array
    const bytes = atob(base64String);
    const byteArray = new Uint8Array(bytes.length);
    
    for (let i = 0; i < bytes.length; i++) {
      byteArray[i] = bytes.charCodeAt(i);
    }

    // Kiểm tra độ dài (phải là 4 byte cho int32)
    if (byteArray.length !== 4) {
      return null;
    }

    // Chuyển đổi 4 byte little-endian thành số nguyên
    const dataView = new DataView(byteArray.buffer);
    const decodedInt = dataView.getInt32(0, true); // true = little-endian

    return decodedInt;
  } catch (error) {
    console.error('Error decoding Base64 ID:', error);
    return null;
  }
};

/**
 * Giải mã Base64 ID từ backend C#
 * @param {string|string[]} input - Chuỗi Base64 hoặc mảng chuỗi Base64
 * @returns {number|number[]|null} - Số nguyên, mảng số nguyên, hoặc null
 */
export const decodeBase64Id = (input) => {
  // Nếu đầu vào là mảng
  if (Array.isArray(input)) {
    return input.map(item => decodeSingleBase64Id(item));
  }
  
  // Nếu đầu vào là chuỗi
  if (typeof input === 'string') {
    return decodeSingleBase64Id(input);
  }
  
  // Nếu đầu vào không hợp lệ
  return null;
};

export default decodeBase64Id; 