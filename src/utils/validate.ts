export function validateUsername(s: string | undefined) {
  if (s === undefined) return;
  if (!s) return "不得为空";
  if (s && !/^[a-zA-Z_][a-zA-Z0-9_]{2,15}$/.test(s)) return "值不合法";
}
export function validatePassword(s: string | undefined) {
  if (s === undefined) return;
  if (!s) return "不得为空";
  if (s && s.length < 6) return "密码过短";
}
export function validateLguid(s: string | undefined) {
  if (s === undefined) return;
  if (!s) return "不得为空";
  if (s && !/^[1-9][0-9]{0,8}$/.test(s)) return "值不合法";
}
