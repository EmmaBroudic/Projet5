(function($) {
  $.fn.mauGallery = function(options) {
    var options = $.extend($.fn.mauGallery.defaults, options);
    var tagsCollection = [];
    return this.each(function() {
      $.fn.mauGallery.methods.createRowWrapper($(this));
      if (options.lightBox) {
        $.fn.mauGallery.methods.createLightBox(
          $(this),
          options.lightboxId,
          options.navigation
        );
      }
      $.fn.mauGallery.listeners(options);

      $(this)
        .children(".gallery-item")
        .each(function(index) {
          $.fn.mauGallery.methods.responsiveImageItem($(this));
          $.fn.mauGallery.methods.moveItemInRowWrapper($(this));
          $.fn.mauGallery.methods.wrapItemInColumn($(this), options.columns);
          var theTag = $(this).data("gallery-tag");
          if (
            options.showTags &&
            theTag !== undefined &&
            tagsCollection.indexOf(theTag) === -1
          ) {
            tagsCollection.push(theTag);
          }
        });

      if (options.showTags) {
        $.fn.mauGallery.methods.showItemTags(
          $(this),
          options.tagsPosition,
          tagsCollection
        );
      }

      $(this).fadeIn(500);
    });
  };
  $.fn.mauGallery.defaults = {
    columns: 3,
    lightBox: true,
    lightboxId: null,
    showTags: true,
    tagsPosition: "bottom",
    navigation: true
  };
  $.fn.mauGallery.listeners = function(options) {
    $(".gallery-item").on("click", function() {
      if (options.lightBox && $(this).prop("tagName") === "IMG") {
        $.fn.mauGallery.methods.openLightBox($(this), options.lightboxId);
      } else {
        return;
      }
    });

    $(".gallery").on("click", ".nav-link", $.fn.mauGallery.methods.filterByTag);
    $(".gallery").on("click", ".mg-prev", () =>
      $.fn.mauGallery.methods.prevImage(options.lightboxId)
    );
    $(".gallery").on("click", ".mg-next", () =>
      $.fn.mauGallery.methods.nextImage(options.lightboxId)
    );
  };
  $.fn.mauGallery.methods = {
    createRowWrapper(element) {
      if (
        !element
          .children()
          .first()
          .hasClass("row")
      ) {
        element.append('<div class="gallery-items-row row"></div>');
      }
    },
    wrapItemInColumn(element, columns) {
      if (columns.constructor === Number) {
        element.wrap(
          `<div class='item-column mb-4 col-${Math.ceil(12 / columns)}'></div>`
        );
      } else if (columns.constructor === Object) {
        var columnClasses = "";
        if (columns.xs) {
          columnClasses += ` col-${Math.ceil(12 / columns.xs)}`;
        }
        if (columns.sm) {
          columnClasses += ` col-sm-${Math.ceil(12 / columns.sm)}`;
        }
        if (columns.md) {
          columnClasses += ` col-md-${Math.ceil(12 / columns.md)}`;
        }
        if (columns.lg) {
          columnClasses += ` col-lg-${Math.ceil(12 / columns.lg)}`;
        }
        if (columns.xl) {
          columnClasses += ` col-xl-${Math.ceil(12 / columns.xl)}`;
        }
        element.wrap(`<div class='item-column mb-4${columnClasses}'></div>`);
      } else {
        console.error(
          `Columns should be defined as numbers or objects. ${typeof columns} is not supported.`
        );
      }
    },
    moveItemInRowWrapper(element) {
      element.appendTo(".gallery-items-row");
    },
    responsiveImageItem(element) {
      if (element.prop("tagName") === "IMG") {
        element.addClass("img-fluid");
      }
    },
    openLightBox(element, lightboxId) {
      $(`#${lightboxId}`)
        .find(".lightboxImage")
        .attr("src", element.attr("src"));
      $(`#${lightboxId}`).modal("toggle");
    },
    prevImage() {
      let activeImage = null;
      $("img.gallery-item").each(function() {
        if ($(this).attr("src") === $(".lightboxImage").attr("src")) {
          activeImage = $(this);
        }
      });
      let activeTag = $(".tags-bar span.active-tag").data("images-toggle");
      let imagesCollection = [];
      if (activeTag === "all") {
        $(".item-column").each(function() {
          if ($(this).children("img").length) {
            imagesCollection.push($(this).children("img"));
          }
        });
      } else {
        $(".item-column").each(function() {
          if (
            $(this)
              .children("img")
              .data("gallery-tag") === activeTag
          ) {
            imagesCollection.push($(this).children("img"));
          }
        });
      }
      let index = 0,
        next = null;

      $(imagesCollection).each(function(i) {
        if ($(activeImage).attr("src") === $(this).attr("src")) {
          index = i ;
        }
      });
      next =
        imagesCollection[index] ||
        imagesCollection[imagesCollection.length - 1];
      $(".lightboxImage").attr("src", $(next).attr("src"));
    },
    nextImage() {
      let activeImage = null;
      $("img.gallery-item").each(function() {
        if ($(this).attr("src") === $(".lightboxImage").attr("src")) {
          activeImage = $(this);
        }
      });
      let activeTag = $(".tags-bar span.active-tag").data("images-toggle");
      let imagesCollection = [];
      if (activeTag === "all") {
        $(".item-column").each(function() {
          if ($(this).children("img").length) {
            imagesCollection.push($(this).children("img"));
          }
        });
      } else {
        $(".item-column").each(function() {
          if (
            $(this)
              .children("img")
              .data("gallery-tag") === activeTag
          ) {
            imagesCollection.push($(this).children("img"));
          }
        });
      }
      let index = 0,
        next = null;

      $(imagesCollection).each(function(i) {
        if ($(activeImage).attr("src") === $(this).attr("src")) {
          index = i;
        }
      });
      next = imagesCollection[index] || imagesCollection[0];
      $(".lightboxImage").attr("src", $(next).attr("src"));
    },

    // ouverture d'une modale pour la galerie d'images
    createLightBox(gallery, lightboxId, navigation) {
      // Fonction pour créer une lightbox pour la galerie d'images
    
      gallery.append(`
        <div class="modal fade" id="${lightboxId ? lightboxId : "galleryLightbox"}" tabindex="-1" role="dialog" aria-hidden="true">
          <!-- La div représentant la lightbox -->
          <div class="modal-dialog" role="document">
            <!-- Div pour la boîte de dialogue -->
            <div class="modal-content">
              <!-- Div pour le contenu de la lightbox -->
              <div class="modal-body">
                <!-- Div pour le corps de la lightbox -->
                ${
                  navigation
                    ? '<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;"><</div>'
                    : '<span style="display:none;" />'
                }
                <!-- Bouton "précédent" ou élément vide en fonction de la valeur de navigation -->
                <img class="lightboxImage img-fluid" alt="Contenu de l'image affichée dans la modale au clique"/>
                <!-- Balise d'image pour afficher l'image -->
                ${
                  navigation
                    ? '<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;}">></div>'
                    : '<span style="display:none;" />'
                }
                <!-- Bouton "suivant" ou élément vide en fonction de la valeur de navigation -->
              </div>
            </div>
          </div>
        </div>`);
    },

    // filtres
    showItemTags(gallery, position, tags) {
      // Crée une barre de navigation pour les étiquettes des images et l'ajoute à la page
      var tagItems =
        '<li class="nav-item"><span class="nav-link active active-tag" data-images-toggle="all">Tous</span></li>';
      // Crée l'élément de liste pour l'option "Tous"
    
      // Parcourt les étiquettes et ajoute des éléments de liste pour chaque étiquette
      $.each(tags, function(index, value) {
        tagItems += `<li class="nav-item active">
                <span class="nav-link" data-images-toggle="${value}">${value}</span></li>`;
      });
    
      // Crée la barre de navigation complète en entourant les éléments de liste avec une balise ul
      var tagsRow = `<ul class="my-4 tags-bar nav nav-pills">${tagItems}</ul>`;
    
      // Ajoute la barre de navigation en fonction de la position spécifiée
      if (position === "bottom") {
        gallery.append(tagsRow); // Ajoute la barre de navigation à la fin de l'élément gallery
      } else if (position === "top") {
        gallery.prepend(tagsRow); // Ajoute la barre de navigation au début de l'élément gallery
      } else {
        console.error(`Unknown tags position: ${position}`); // Affiche une erreur si la position spécifiée n'est ni "bottom" ni "top"
      }
    },
    
    filterByTag() {
      // Fonction pour filtrer les images par étiquette lorsqu'un élément de la barre de navigation est cliqué
    
      if ($(this).hasClass("active-tag")) {
        return; // Si l'élément cliqué a déjà la classe "active-tag", ne fait rien
      }
    
      $(".active-tag").removeClass("active active-tag"); // Supprime la classe "active active-tag" de tous les éléments de la barre de navigation
      $(this).addClass("active-tag"); // Ajoute la classe "active-tag" à l'élément cliqué
    
      var tag = $(this).data("images-toggle"); // Récupère la valeur de l'attribut data-images-toggle de l'élément cliqué
    
      // Ajoute la classe CSS ".nav-link.active" aux éléments .nav-link correspondant au filtre actif
      $(".nav-link").removeClass("active");
      $(`.nav-link[data-images-toggle="${tag}"]`).addClass("active");

      // Parcourt toutes les images de la galerie et affiche/masque les éléments parent correspondants
      $(".gallery-item").each(function() {
        $(this)
          .parents(".item-column")
          .hide(); // Masque l'élément parent de l'image
    
        if (tag === "all") {
          $(this)
            .parents(".item-column")
            .show(300); // Affiche l'élément parent si l'étiquette sélectionnée est "all"
        } else if ($(this).data("gallery-tag") === tag) {
          $(this)
            .parents(".item-column")
            .show(300); // Affiche l'élément parent si l'étiquette de l'image correspond à l'étiquette sélectionnée
        }
      });
    }
  };
})(jQuery);
