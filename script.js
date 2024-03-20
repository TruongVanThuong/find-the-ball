(function ($) {
  // DOM elems
  var $troChoi;
  var $hang;
  var $coc;
  var $quaBong;
  var $ketQuaTroChoi;
  var $playBtn;

  $(document).ready(function () {
    $troChoi = $("#game");
    $hang = $troChoi.find(".row");
    $coc = $troChoi.find(".cup");
    $quaBong = $troChoi.find(".ball");
    $ketQuaTroChoi = $troChoi.find("#game-result");
    $playBtn = $("#btn-play");

    khoiTaoTroChoi();
  });

  function khoiTaoTroChoi() {
    // Các biến cấu hình
    var tocDoHoatHinh = 550;
    var tocDoLap = tocDoHoatHinh + 100;
    var soLanHoanViToiDa = 5;

    // Các biến trò chơi
    var viTriQuaBong;
    var viTriQuaBongDoc;
    var khoangCachHoatHinh;
    var khoangRongCoc = $coc.outerWidth(true);
    var khoangCaoCoc = $coc.outerHeight(true);
    var soCoc = $coc.length;
    var soLanHoanVi = 0;

    // Animation

    function diChuyen($phuongTienDiChuyen, chieuSau) {
      var viTriCoc = [];
      var viTriBatDau = $phuongTienDiChuyen.data("viTriBatDau");
      var viTriHienTai = $phuongTienDiChuyen.data("viTriHienTai");
      // ----------------------------------------------------------------
      viTriCoc[0] = {
        x: 0,
        y: 0,
      };
      for (var i = 1; i < soCoc; i++) {
        if (i < 3) {
          var prevCoc = viTriCoc[i - 1];
          viTriCoc[i] = {
            x: prevCoc.x + khoangRongCoc,
            y: prevCoc.y,
          };
        } else {
          var prevCoc = viTriCoc[i - 3];
          viTriCoc[i] = {
            x: prevCoc.x,
            y: prevCoc.y + khoangCaoCoc,
          };
        }
      }
      // ----------------------------------------------------------------
      viTriBatDau = viTriCoc[viTriBatDau];
      viTriHienTai = viTriCoc[viTriHienTai];
      var xBD = viTriBatDau.x;
      var yBD = viTriBatDau.y;
      var xHT = viTriHienTai.x;
      var yHT = viTriHienTai.y;

      var zindex = "auto";
      var tyLe;

      if (chieuSau > 0) {
        zindex = 5;
        tyLe = 1.25;
      } else {
        tyLe = 0.75;
        zindex = -5;
      }

      $phuongTienDiChuyen
        .css("z-index", zindex)
        .transition(
          {
            left: xBD,
            top: yBD,
            scale: tyLe,
          },
          {
            duration: tocDoHoatHinh / 2,
            easing: "linear",
          }
        )
        .transition(
          {
            left: xHT,
            top: yHT,
            scale: 1,
          },
          {
            duration: tocDoHoatHinh / 2,
            easing: "linear",
            complete: function () {
              $phuongTienDiChuyen.css("z-index", "auto");

              soLanHoanVi += 0.5;

              if (soLanHoanVi >= soLanHoanViToiDa) {
                clearInterval(khoangCachHoatHinh);
                ketThuc();
              }
            },
          }
        );
    }

    function hoanViCacCoc($cocDauTien, $cocThuHai) {
      var viTriCocDauTien = $cocDauTien.data("viTriHienTai");
      var viTriCocThuHai = $cocThuHai.data("viTriHienTai");
      $cocDauTien.data("viTriHienTai", viTriCocThuHai);
      $cocThuHai.data("viTriHienTai", viTriCocDauTien);
      if (viTriCocDauTien > viTriCocThuHai) {
        diChuyen($cocDauTien, 1);
        diChuyen($cocThuHai, 0);
      } else {
        diChuyen($cocDauTien, 1);
        diChuyen($cocThuHai, 0);
      }
    }

    function hoatHinhCacCoc() {
      var viTriCocDauTien = Math.floor(Math.random() * soCoc);
      var viTriCocThuHai;
      var $cocDauTien;
      var $cocThuHai;

      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * soCoc);
      } while (randomIndex === viTriCocDauTien);
      viTriCocThuHai = randomIndex;
      $cocDauTien = $coc.eq(viTriCocDauTien);
      $cocThuHai = $coc.eq(viTriCocThuHai);

      hoanViCacCoc($cocDauTien, $cocThuHai);
    }

    // Starts a game
    function batDau() {
      soLanHoanVi = 0;
      viTriQuaBong = Math.floor((Math.random() * soCoc) / 2);
      viTriQuaBongDoc = Math.floor((Math.random() * (soCoc - 3) + 3) / 3);
      $playBtn.off("click");
      $troChoi.off("click");

      // Cập nhật vị trí các cốc
      $coc.each(function () {
        var viTriCuoi = $(this).data("viTriHienTai");
        $(this).data("viTriBatDau", viTriCuoi);
      });

      // Hiển thị quả bóng
      $quaBong
        .css({
          left: viTriQuaBong * khoangRongCoc + 10,
          top: viTriQuaBongDoc * khoangCaoCoc - 10,
        })
        .fadeIn()
        .delay(600)
        .fadeOut(function () {
          khoangCachHoatHinh = setInterval(hoatHinhCacCoc, tocDoLap);
        });
    }

    // End of game
    function ketThuc() {
      // $playBtn.on("click", batDau);

      $troChoi.on("click", ".cup", function () {
        var viTriBatDau = $(this).data("viTriBatDau");
        var viTriCuoi = $(this).data("viTriHienTai");
        var viTriCoc = [];
        if (viTriQuaBong === viTriBatDau) {
          $troChoi.off("click", ".cup");
          // ----------------------------------------------------------------
          viTriCoc[0] = {
            x: 0,
            y: 0,
          };
          for (var i = 1; i < soCoc; i++) {
            if (i < 3) {
              var prevCoc = viTriCoc[i - 1];
              viTriCoc[i] = {
                x: prevCoc.x + khoangRongCoc,
                y: prevCoc.y,
              };
            } else {
              var prevCoc = viTriCoc[i - 3];
              viTriCoc[i] = {
                x: prevCoc.x,
                y: prevCoc.y + khoangCaoCoc,
              };
            }
          }
          // ----------------------------------------------------------------
          viTriCuoi = viTriCoc[viTriCuoi];
          if(viTriCuoi.y === 0) {
            viTriCuoi.y = khoangCaoCoc;
          }else {
            viTriCuoi.y = khoangCaoCoc * 2;
          }
          // Hiển thị quả bóng
          $quaBong
            .css({
              left: viTriCuoi.x  + 10,
              top: viTriCuoi.y - 10,
            })
            .stop(true, false)
            .fadeIn()
            .delay(600)
            .fadeOut();

          $ketQuaTroChoi.text("Chính xác!");
          $playBtn.on("click", batDau);
        } else {
          $ketQuaTroChoi.text("Chọn lại!");
        }

        $ketQuaTroChoi.stop(true, false).fadeIn().delay(600).fadeOut();
      });
    }

    function khoiTao() {
      // Khởi tạo vị trí
      $coc.each(function (i) {
        $(this).data({ viTriBatDau: i, viTriHienTai: i });
      });

      $playBtn.on("click", batDau);
    }

    khoiTao();
  }
})(jQuery);
