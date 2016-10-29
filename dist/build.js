function generateLine(e, a) {
  return {
    x1: e.x,
    y1: e.y,
    x2: a.x,
    y2: a.y
  }
}

function getPoints(e) {
  return [{
    x: e.x1,
    y: e.y1
  }, {
    x: e.x2,
    y: e.y2
  }]
}

function calcDistance(e, a) {
  return Math.sqrt(Math.pow(a.x - e.x, 2) + Math.pow(a.y - e.y, 2))
}

function calcSize(e) {
  return Math.sqrt(Math.pow(e.x2 - e.x1, 2) + Math.pow(e.y2 - e.y1, 2))
}

function calcIntersection(e, a) {
  var n = ((e.x1 * e.y2 - e.y1 * e.x2) * (a.x1 - a.x2) - (e.x1 - e.x2) * (a.x1 * a.y2 - a.y1 * a.x2)) / ((e.x1 - e.x2) * (a.y1 - a.y2) - (e.y1 - e.y2) * (a.x1 - a.x2));
  var i = ((e.x1 * e.y2 - e.y1 * e.x2) * (a.y1 - a.y2) - (e.y1 - e.y2) * (a.x1 * a.y2 - a.y1 * a.x2)) / ((e.x1 - e.x2) * (a.y1 - a.y2) - (e.y1 - e.y2) * (a.x1 - a.x2));
  return {
    x: n,
    y: i
  }
}

function calcMax(e, a) {
  return calcDistance({
    x: e.x1,
    y: e.y1
  }, {
    x: e.x2,
    y: e.y2
  }) < calcDistance({
    x: a.x1,
    y: a.y1
  }, {
    x: a.x2,
    y: a.y2
  }) ? a : e
}

function calcMin(e, a) {
  return calcDistance({
    x: e.x1,
    y: e.y1
  }, {
    x: e.x2,
    y: e.y2
  }) >= calcDistance({
    x: a.x1,
    y: a.y1
  }, {
    x: a.x2,
    y: a.y2
  }) ? a : e
}

function calcAngle(e, a) {
  return Math.atan((a.y - e.y) / (a.x - e.x))
}

function calcPolygonArea(e) {
  var a = 0;
  for (var n = 0, i = e.length; n < i; n++) {
    var t = e[n].x;
    var r = e[n == e.length - 1 ? 0 : n + 1].y;
    var c = e[n == e.length - 1 ? 0 : n + 1].x;
    var o = e[n].y;
    a += t * r * .5;
    a -= c * o * .5
  }
  return Math.abs(a)
}
AFRAME.registerComponent("ar-camera", {
  schema: {
    elid: {
      type: "string"
    }
  },
  init: function() {
    window.ARcamera = {};
    window.ARcamera.video_component = this.el;
    window.ARcamera.canvas = document.createElement("canvas");
    window.ARcamera.el_obj = document.getElementById(this.data.elid);
    window.ARcamera.detector = new AR.Detector;
    window.ARcamera.size_real = 400;
    window.ARcamera.timeDelta = 0
  },
  update: function(e) {
    if (e.elid !== this.data.elid) {
      window.ARcamera.el_obj = document.getElementById(this.data.elid)
    }
  },
  tick: function(e, a) {
    window.ARcamera.timeDelta += a;
    if (window.ARcamera.timeDelta < 25) {
      return
    }
    window.ARcamera.timeDelta = 0;
    if (typeof window.ARcamera.video == "undefined") {
      if (window.ARcamera.video_component.getAttribute("src") != null) {
        window.ARcamera.video = document.getElementById(window.ARcamera.video_component.getAttribute("src").substr(1));
        window.ARcamera.canvas.width = window.ARcamera.video.videoWidth;
        window.ARcamera.canvas.height = window.ARcamera.video.videoHeight;
        window.ARcamera.context = window.ARcamera.canvas.getContext("2d");
        window.ARcamera.view_width = window.ARcamera.video_component.getAttribute("width"), window.ARcamera.view_heigth = window.ARcamera.video_component.getAttribute("height")
      }
    } else {
      window.ARcamera.context.drawImage(window.ARcamera.video, 0, 0, window.ARcamera.video.videoWidth, window.ARcamera.video.videoHeight);
      var n = window.ARcamera.context.getImageData(0, 0, window.ARcamera.canvas.width, window.ARcamera.canvas.height);
      var i = window.ARcamera.detector.detect(n);
      if (i.length > 0) {
        var t = i[0].corners;
        var r = calcIntersection(generateLine(t[0], t[2]), generateLine(t[1], t[3]));
        if (Math.abs(calcAngle(t[0], t[1])) < Math.PI / 8 && Math.abs(calcAngle(t[2], t[3])) < Math.PI / 8) {
          line_near = calcMax(generateLine(t[0], t[1]), generateLine(t[2], t[3]));
          line_far = calcMin(generateLine(t[0], t[1]), generateLine(t[2], t[3]));
          line_side1 = generateLine(t[1], t[2]);
          line_side2 = generateLine(t[3], t[0])
        } else if (Math.abs(calcAngle(t[1], t[2])) < Math.PI / 8 && Math.abs(calcAngle(t[3], t[0])) < Math.PI / 8) {
          line_near = calcMax(generateLine(t[1], t[2]), generateLine(t[3], t[0]));
          line_far = calcMin(generateLine(t[1], t[2]), generateLine(t[3], t[0]));
          line_side1 = generateLine(t[0], t[1]);
          line_side2 = generateLine(t[2], t[3])
        } else {
          line_near = generateLine(t[1], t[2]);
          line_far = generateLine(t[3], t[0]);
          line_side1 = generateLine(t[0], t[1]);
          line_side2 = generateLine(t[2], t[3])
        }
        line_final = line_near;
        line_near_size = calcSize(line_near);
        x_final = r.x * window.ARcamera.view_width / window.ARcamera.canvas.width - window.ARcamera.view_width * .5;
        y_final = r.y * window.ARcamera.view_heigth / window.ARcamera.canvas.height - window.ARcamera.view_heigth * .5;
        z_final = window.ARcamera.size_real / line_near_size;
        y_final = y_final * Math.cos(Math.atan(y_final / z_final));
        x_final = x_final * Math.cos(Math.atan(x_final / z_final));
        z_rot = 180 * calcAngle(getPoints(line_final)[0], getPoints(line_final)[1]) / Math.PI;
        x_rot = 180 * Math.atan((line_near_size - calcSize(line_side1)) / line_near_size) / Math.PI;
        y_rot = -180 * Math.atan(x_final / z_final) / Math.PI;
        var c = window.ARcamera.el_obj.getAttribute("position");
        var o = window.ARcamera.el_obj.getAttribute("rotation");
        c.x = -x_final;
        c.y = -y_final;
        c.z = -z_final;
        o.x = -x_rot;
        o.y = -y_rot;
        o.z = z_rot;
        window.ARcamera.el_obj.setAttribute("position", c);
        window.ARcamera.el_obj.setAttribute("rotation", o)
      }
    }
  }
});
