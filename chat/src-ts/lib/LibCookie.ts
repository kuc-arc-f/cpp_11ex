
const LibCookie = {
  /**
   * クッキーを設定する関数
   * @param {string} name - クッキー名
   * @param {string} value - 保存する値
   * @param {number} days - 有効期限（日数）
   */
  setCookie: function (name, value, days) {
      let expires = "";
      if (days) {
          const date = new Date();
          // 現在時刻に日数を足す
          date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
          expires = "; expires=" + date.toUTCString();
      }
      
      // 値のエンコードと属性の付与
      // ※現代のブラウザでは SameSite=Lax; Secure の指定が推奨されます
      document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/; SameSite=Lax; Secure`;
  }

}
export default LibCookie;