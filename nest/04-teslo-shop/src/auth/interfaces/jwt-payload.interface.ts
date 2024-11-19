export interface JwtPayload {
  id: string; // Always use unique fields, even unknown to the user such as the id, to send information in payloads.

  // TODO: Add any data to be saved
}
