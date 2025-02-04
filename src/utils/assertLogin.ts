export default function assertLogin(
  x:
    | {
        uid: string;
        username: string;
      }
    | undefined
): asserts x {
  if (x === undefined) throw new Error("Not authenticated");
}
