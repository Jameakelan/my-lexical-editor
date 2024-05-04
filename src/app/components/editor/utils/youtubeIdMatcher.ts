export function youtubeIdMatcher(url: string) {
  const match =
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/.exec(url);

  const id = match ? (match?.[2].length === 11 ? match[2] : null) : null;
  return id;
}
