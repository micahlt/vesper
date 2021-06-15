const textField = document.getElementsByClassName("input")[0];
const submit = document.getElementById("submit");
const downloader = document.getElementsByClassName("form")[0];
const loader = document.getElementsByClassName("loader")[0];
const render = document.getElementById("render-vids");
const another = document.getElementById("another");
const fakeButton = (url) => {
  const a = document.createElement('a');
  a.href = url;
  a.download = url;
  a.style.display = "none";
  a.target = "blank";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
const fancyTimeFormat = (duration) => {
  var hrs = ~~(duration / 3600);
  var mins = ~~((duration % 3600) / 60);
  var secs = ~~duration % 60;
  var ret = "";
  if (hrs > 0) {
    ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
  }
  ret += "" + mins + ":" + (secs < 10 ? "0" : "");
  ret += "" + secs;
  return ret;
}
const formatBytes = (bytes, decimals = 2) => {
  if (!bytes) return 'Unknown size'
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
const generateVideo = (obj, title, creator, thumb, duration) => {
  console.log([title, creator, thumb, duration])
  if (title.length > 30) {
    title = title.slice(0, 20) + '...';
  }
  if (creator.length > 30) {
    creator = creator.slice(0, 20) + '...';
  }
  const template = `
    <img src="${thumb}" alt="video thumbnail">
    <div class="data">
      <h2>${title}</h2>
      <p class="author">by ${creator}</p>
      <ul>
        <li><span class="material-icons">watch_later</span> ${fancyTimeFormat(duration)}</li>
        <li><span class="material-icons">video_settings</span> ${obj.ext.toUpperCase()}</li>
        <li><span class="material-icons">save</span> ${formatBytes(obj.filesize)}</li>
        <li><span class="material-icons">fit_screen</span> ${obj.width}x${obj.height}</li>
      </ul>
    </div>`;
  let newHTML = document.createElement("div");
  newHTML.classList.add("video");
  newHTML.title = "Download this format";
  newHTML.innerHTML = template;
  render.appendChild(newHTML);
  newHTML.addEventListener("click", () => {
    fakeButton(obj.url);
  });
}
const download = (url) => {
  downloader.style.display = "none";
  loader.style.display = "inherit";
  fetch(`/api/download?v=${url}`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return 1;
      }
    })
    .then((data) => {
      if (data == 1) {
        alert('Error!');
        return;
      }
      loader.style.display = "none";
      data.formats.forEach((item) => {
        if (item.asr == null || item.width == null || item.height == null) {
          return;
        }
        if (data.creator) {
          generateVideo(item, data.title, data.creator, data.thumbnail, data.duration);
        } else {
          generateVideo(item, data.title, data.channel, data.thumbnail, data.duration);
        }
      });
      another.style.display = "block";
    });
}

textField.addEventListener("keyup", function(event) {
  if (event.key === "Enter") {
    download(textField.value);
  }
});

submit.addEventListener("click", function() {
  download(textField.value);
});

another.addEventListener("click", function() {
  window.location.reload();
})