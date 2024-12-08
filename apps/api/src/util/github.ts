export function getUsernameAndRepo(url: string) {
  const splittedUrl = url.split('/').filter((url) => !!url.length);
  if (splittedUrl.length) {
    return {
      repo: splittedUrl.pop(),
      username: splittedUrl.pop(),
    };
  }
  return null;
}
