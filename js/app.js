$(document).ready(function(){
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDctP3tx5mcamHdhRpKvyVVQhCIC-tbku8",
    authDomain: "egresados-35f73.firebaseapp.com",
    databaseURL: "https://egresados-35f73.firebaseio.com",
    projectId: "egresados-35f73",
    storageBucket: "egresados-35f73.appspot.com",
    messagingSenderId: "894426133918"
  };
  firebase.initializeApp(config);

  //Focus
  $('#cajaTexto').focus();
  $('#cajaTexto').val('');

  //Enter
  $('#cajaTexto').keyup(function(event){
    //1.- Ya que la MATRICULA son numero, si ingresa texto lo canmbia
    this.value = this.value.replace(/[^0-9\.]/g,'');
    //2.- Obtenemos el valor de la caja de texto

    //3.- Preguntamos si ingreso ENTER
    if(event.keyCode == 13){

      //4.- Si presiono ENTER llamamo a la funcion enviarDatos()...
      //...a traves del evento CLICK() del BOTON definido en el HTML.
      document.getElementById("inputSearch").click();

    }
  });
});
function existeUsuario(id){
  var rootRef = firebase.database().ref();
  var usersRef = rootRef.child("users");
  usersRef.child(id).once('value', function(snapshot) {
    var exist = (snapshot.val() !== null);


  });
}
function writeUserData(id) {
    //alert("writeUserData");
    var now = new Date(Date.now());
    var formatted = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();

    $('#result').html('<p class="status_blue">Registrado...<br>Matricula: '+id+'<br> Hra. Entrada:'+formatted+'</p>');

    firebase.database().ref('users/'+id).set({
    horaEntrada: formatted,
    matricula: id,
    totalHoras: "00:00:00"
  });
}
function updateUserData(id){
  //alert(firebase.database().ref('users/'+id));

  var adaNameRef = firebase.database().ref('users/'+id);
  adaNameRef.once('value').then(function(snapshot) {

    var bandera = snapshot.val().horaEntrada;
    if(bandera == "-1"){
      //alert("es -1 Entrando...");
      //Obtenemos la hora actual
      var now = new Date(Date.now());
      var formatted = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();

      $('#result').html('<p class="status_green">Entrando...'+'<br>'+'Hra: '+formatted+'<br> Matricula: '+id+'</p>');

      //Updateamos
      adaNameRef.update({
        horaEntrada: formatted
      });

    }else {
      //alert("Salidendo...");

      //Obtenemos la hora de entrada
      var horaEntrada = snapshot.val().horaEntrada;
      //alert("horaEntrada: "+ horaEntrada);

      //Obtenemos la hora actual
      var now = new Date(Date.now());
      var formatted = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
      console.log(formatted);

      var hora1 = (formatted).split(":"),
          hora2 = (horaEntrada).split(":"),
          t1 = new Date(),
          t2 = new Date();

      console.log(hora1);
      console.log(hora2);

      t1.setHours(hora1[0], hora1[1], hora1[2]);
      t2.setHours(hora2[0], hora2[1], hora2[2]);

      //Hacemos la diferencia
      t1.setHours(t1.getHours() - t2.getHours(), t1.getMinutes() - t2.getMinutes(), t1.getSeconds() - t2.getSeconds());

      //Guardamos el resultado
      var horasAcumuladas = t1.getHours() + ":" + t1.getMinutes() + ":" + t1.getSeconds();
      //alert("horasAcumuladas: "+horasAcumuladas);

      //Obtenemos las horas acumuladas
      var totalHoras = snapshot.val().totalHoras;
      //alert("totalHoras: "+ totalHoras);

      var hora3 = (totalHoras).split(":"),
          hora4 = (horasAcumuladas).split(":"),
          t3 = new Date(),
          t4 = new Date();

      console.log(hora3);
      console.log(hora4);

      t3.setHours(hora3[0], hora3[1], hora3[2]);
      t4.setHours(hora4[0], hora4[1], hora4[2]);

      //Hacemos la suma
      t3.setHours(t3.getHours() + t4.getHours(), t3.getMinutes() + t4.getMinutes(), t3.getSeconds() + t4.getSeconds());

      //Guardamos el resultado
      var newTotalHoras = t3.getHours() + ":" + t3.getMinutes() + ":" + t3.getSeconds();
      //alert("newTotalHoras: "+newTotalHoras);

      $('#result').html('<p class="status_red">Saliendo...'+'<br>'+'Hra: '+formatted+'<br> Matricula: '+id+'<br> Total: '+newTotalHoras+'</p>');

      //Updateamos
      adaNameRef.update({
        horaEntrada: "-1",
        totalHoras: newTotalHoras
      });
    }
  });
}
function enviarDatos(){
  var caja = document.getElementById("cajaTexto");
  var matricula = $('#cajaTexto').val();
  $('#cajaTexto').val('');
  console.log(matricula);

  //1.- Obtenemos el valor de la caja de texto
  //matricula = matricula.substr(1, 9);
  //console.log("matricula: " + matricula);
  //2.- Aseguramos que la MATRICULA tenga la LONGITUD correcta
  if(matricula.length == 6)
  {
    //existeUsuario(matricula);
    var rootRef = firebase.database().ref();
    var usersRef = rootRef.child("users");
    usersRef.child(matricula).once('value', function(snapshot) {
      var exist = (snapshot.val() !== null);
      //alert("exist"+exist);
      if(exist){
        updateUserData(matricula);
      } else {
        writeUserData(matricula);
      }
    });

  } else {

    $('#cajaTexto').val('');
    $('#result').html('<p class="warning">Ingrese matricula válida de 6 digitos.</p>');

    $('#cajaTexto').focus();
  }
}
