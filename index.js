// const navSlide = () => {
//     const sider=document.querySelector('.sidebar');
//     const nav=document.querySelector('.nav-links');
//     const navLink=document.querySelectorAll('.nav-links li');
//     sider.addEventListener('click',()=>{
//         nav.classList.toggle('nav-active');
//         navLink.forEach((link,index) =>
//         {
//          if(link.style.animation){
//             link.style.animation='';
//         }
//         else{
//             link.style.animation=`navLinkFade 0.5s ease forwards ${index/7 + 1.5}s`; 
//         }
//     });
//     });
   
// }
// // const app=()=>{
// //     navSlide();
// //     navSlide();
// //     navSlide();
// //     navSlide();
// // }a
// navSlide();

function getlocation()
{
   if(navigator.geolocation)
   {
     // console.log(navigator.geolocation.getCurrentPosition(showPosition));
     navigator.geolocation.getCurrentPosition(showPosition);
   }
   else {
     alert("Browser Not Supporting");
   }

}
function showPosition(position)
{
  // alert("a");
  var url = "https://developers.zomato.com/api/v2.1/cities?lat="+position.coords.latitude+"&lon="+position.coords.longitude+"&apikey=13308433d97b2d85d003fb417b3932ef"
  // alert("url");
  console.log(url);
  var xhr = new XMLHttpRequest();
  xhr.open('GET',url);
  xhr.onreadystatechange=test;
    function test()
    {
      if(this.status===200 && this.readyState===4)
      {
        var res_data=JSON.parse(this.responseText);
        console.log(typeof res_data);
        console.log(res_data);
        var flag=res_data.location_suggestions[0].country_flag_url;
        var city_name=res_data.location_suggestions[0].name;
       // var country_name=res_data.location_suggestions[0].country_name;
       // var state_name=res_data.location_suggestions[0].state_name;
        index_location.value=city_name;
        // findfood_location.innerHTML=city_name+", "+country_name;
      }
    }
  xhr.send();
}
var city1_name=document.getElementById('index_location')
  var rest_name=document.getElementById('res_name')
  var btn=document.getElementById('btn')
  btn.addEventListener('click',fun)

  var city_id
function fun()
{
  var cityUrl='https://developers.zomato.com/api/v2.1/locations?query='+ city1_name.value +'&apikey=13308433d97b2d85d003fb417b3932ef'
  var xhr2=new XMLHttpRequest();
  xhr2.open('Get',cityUrl);
  xhr2.onreadystatechange=function(){
    if(this.status==200 && this.readyState==4){
      var responseData=JSON.parse(this.responseText)
     city_id=responseData.location_suggestions[0].city_id;
     getrest();
}
   }
  xhr2.send();
}

function getrest()
{
  var resUrl='https://developers.zomato.com/api/v2.1/search?entity_id='+city_id+'&entity_type=city&q='+rest_name.value+'&count=10&apikey=13308433d97b2d85d003fb417b3932ef';
  $.get(resUrl,function(resp){
    console.log(resp);
    $('#restaurants').html("");
        for(var i=0;i<resp.restaurants.length;i++)
        {
            $('#restaurants').append(
            `<div class='col-3 mb-5 ml-4 mr-4'>
                <div class="card hov" style="width: 18rem;height:25rem">
                    <img  src=${resp.restaurants[i].restaurant.featured_image} class="card-img-top" height="270px" width="100px" alt="No image">
                        <div class="card-body">
                        <p class="card-text"><b>${resp.restaurants[i].restaurant.name}</b></p>
                            <button value=${resp.restaurants[i].restaurant.id} id="rest_image" data-toggle="modal" data-target="#exampleModal" class="btn btn-primary">Show Restaurant</button>
                            </div>
                    </div>
                </div>
            </div>`
            )
        }
             
               
         })  
}

$(document).on("click","#rest_image",function(){
  console.log("HEY");
 var ress=$(this);
 var ressid=ress[0].value;
 console.log(ressid) ;
 var url="https://developers.zomato.com/api/v2.1/restaurant?res_id="+ressid+'&apikey=13308433d97b2d85d003fb417b3932ef'
 $.get(url,function(resp){
   console.log(resp);
   $('#restname').html(resp.name);
   $('#getreviews').val(ressid);
   $('#modalbody').html(`<h3>Location : ${resp.location.address}<br>Timings : ${resp.timings}<br>Cuisines : ${resp.cuisines}<br>User Rating : ${resp.user_rating.aggregate_rating}</h3>`);
 })
});


$(document).on("click","#getreviews",function(){
  var ress=$(this);
  var ressid=ress[0].value;
  console.log(ressid);
  $('#exampleModal').modal('hide');
  $('#reviewsmodal').modal('show');
  var url='https://developers.zomato.com/api/v2.1/reviews?res_id='+ressid+'&apikey=13308433d97b2d85d003fb417b3932ef';
  $.get(url,function(resp){
    console.log(resp);
    $('#modalBody').html("");
    $('#restnamee').html("Reviews"    );
    if(resp.reviews_count==0)
    $('#modalBody').append("There are no reviews");
    for(var i=0;i<resp.reviews_count && i<5;i++){
      if(resp.user_reviews[i].review.review_text)
      $('#modalBody').append(`
      <h4>Rating : ${resp.user_reviews[i].review.rating}</h4>
      <p>${resp.user_reviews[i].review.review_text}</p><br><br>
      `);
      
    }
  })
})