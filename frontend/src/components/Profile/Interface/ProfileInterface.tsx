export default interface ProfileInterface {
  id: number,
  email: string,
  displayName: string,
  imageUrl: string,
  blockedUserIds: number[],
  matching: boolean,
  inGame: boolean,
  victories: number,
  log: boolean,
}