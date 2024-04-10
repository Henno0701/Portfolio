window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 5 || document.documentElement.scrollTop > 5) {
    document.getElementById("navbar").style.backgroundColor = "rgba(0, 0, 0, 0.2)";
    // document.getElementById("navbar").style.height = "50px";
  } else {
    document.getElementById("navbar").style.backgroundColor = "transparent";
    // document.getElementById("navbar").style.height = "75px";

  }
}

