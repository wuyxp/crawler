/**
 * Created by wuyang on 2016/12/1.
 */
$(function(){

  $.ajax({
    url:'/qingyun/instance/api/',
    type:'get',
    success:function(data){
      var trStr = '';
      console.log(data);
      if(data.code == 0){
        data.list.forEach((item) => {
          var {images, resourceClass, cpu, memory, price, date} = item;
          trStr += `
            <tr>
            <td>${images}</td>
            <td>${resourceClass}</td>
            <td>${cpu}</td>
            <td>${memory}</td>
            <td>${price}</td>
            <td>${date}</td>
            </tr>
          `
        });
        $('#instanceTable').html(trStr);
      }else{

      }
    },
    error:function(err){
      console.log(err)
    }
  })
})