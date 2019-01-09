  <script type="text/javascript" src="jquery.js"></script>
  <script type="text/javascript">

    $(document).ready(function(){

      $.ajax({
        type:'post',
        url:'store_items.php',
        data:{
          total_cart_items:"totalitems"
        },
        success:function(response) {
          document.getElementById("total_items").value=response;
        }
      })

    });

    function addToCart(req, res)
    {
        if(req.err){
            console.log(req.err);
        }
        var qty = parseInt(document.getElementsByName("qty"), 10);
        var product_id = parseInt(document.getElementsByName("product_id"), 10);
        var nonce = parseInt(document.getElementsByName("nonce"), 10);
        var cart = (cart) ? cart : null;
	
	  $.ajax({
        type:'post',
        url:'/',
        data:{
          item_src:img_src,
          item_name:name,
          item_price:price
        },
        success:function(response) {
          document.getElementById("total_items").value=response;
        }
      });
	
    }

    router.post('/', function(req, res) {
    if(req.err){
        console.log(req.err);
    }

    getElementsByName
    

    if(qty > 0 && Security.isValidNonce(nonce, req)) {
        Product.findOne({product_id: product}).then(prod => {
            let cart = (req.session.cart) ? req.session.cart : null;
            Cart.addToCart(prod, qty, cart);
            res.redirect('back');
        }).catch(err => {
           res.redirect('/');
        });
    } else {
        res.redirect('/');
    }
});
	
</script>