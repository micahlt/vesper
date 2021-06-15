const ytdl = require('youtube-dl-exec');

module.exports = (req, res) => {
  if (req.query.v) {
    ytdl(req.query.v, {
      dumpSingleJson: true,
      noWarnings: true,
      noCallHome: true,
      noCheckCertificate: true,
      preferFreeFormats: true,
      youtubeSkipDashManifest: true,
    })
    .then((data) => {
      res.send(data);
    })
  } else {
    res.send(400);
  }
}
