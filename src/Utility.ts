export class Utility {
  public renderAppHeader = () => {
    console.clear();
    const title = 'Slay the Spire save editor. v0.0.1';
    const totalLength = 120;
    const beforeLength = Math.floor((totalLength - title.length) / 2);
    const afterLength = totalLength - (title.length + beforeLength);
    console.info(`${'='.repeat(beforeLength)}${title}${'='.repeat(afterLength)}`);
  }
}