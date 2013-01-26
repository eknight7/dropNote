// Dropbox authentication 
$(document).ready(function(){
    var client = new Dropbox.Client({
        key: "NJo05Ex2ifA=|FuwYACznlMDmTchIp4AN5qegZ1KCzwMiNKfAjSspvw=="
    });
    client.authDriver(new Dropbox.Drivers.Redirect({rememberUser: true}));
    client.authenticate(function(error,client){
        if (error){
            // Replace with a call to your own error-handling code.
            //
            // Don't forget to return from the callback, so you don't execute the code
            // that assumes everything went well.
            alert("Authenticate Error");
            return showError(error);
        }
        $("#textbox").on('click',function(e){
            e.preventDefault();
            saveNote(client);
        });
        $("#mkdir").on('click',function(e){
            e.preventDefault();
            makeDirectory(client);
        });
        $("#delFile").on('click',function(e){
            e.preventDefault();
            deleteFile(client);
        });
        // Replace with a call to your own application code.
        //
        // The user authorized your app, and everything went well.
        // client is a Dropbox.Client instance that you can use to make API calls.
        //doSomethingCool(client);
        
    });

    //alert("Client");
    var showError = function(error) {
        switch (error.status) {
            case 401:
            // If you're using dropbox.js, the only cause behind this error is that
            // the user token expired.
            // Get the user through the authentication flow again.
                alert("Authentication re-required");
            break;

            case 404:
            // The file or folder you tried to access is not in the user's Dropbox.
            // Handling this error is specific to your application.
                alert("File/Folder is note in Dropbox");
            break;

            case 507:
            // The user is over their Dropbox quota.
            // Tell them their Dropbox is full. Refreshing the page won't help.
                alert("Dropbox is full");
            break;

            case 503:
            // Too many API requests. Tell the user to try again later.
            // Long-term, optimize your code to use fewer API calls.
                alert("Too many API request");
            break;

            case 400:  // Bad input parameter
                alert("Bad input parameter");
            case 403:  // Bad OAuth request.
                alert("Bad OAuth request");
            case 405:  // Request method not expected
                alert("Request method not expected");
            default:
            // Caused by a bug in dropbox.js, in your application, or in Dropbox.
            // Tell the user an error occurred, ask them to refresh the page.
            alert("Bug in dropbox.js ..."+error);
        }
    };

    // the app note saving functionality

    //var glNoteId = window.name; // what the note is going to be saved as

    var glNoteId = "text_save.txt";

    // save the note 
    var saveNote = function(client){
        //var glNoteId = window.name; // what the note is going to be saved as
        //var glNoteId = "text_save.txt";
        var glNoteId = prompt("Save as?(.txt)", "text_new_file.txt");
        text = $("#notecontents");
        if (text.length){
            text = text[0].value;
            client.writeFile(glNoteId, text, function(error, stat) {
                if (error) {
                    return showError(error);  // Something went wrong.
                }
            });
        }
        else{
            alert("No text to save :( ");
        }
    };

    // make a new directory
    var makeDirectory = function(client){
        var dirName = prompt("New Directory Name?", "newDir");
        if (dirName.length){
            client.mkdir(dirName, function(error, stat) {
                if (error) {
                    return showError(error); // Something went wrong :(
                }
            });
        }
        else{
            alert("No directory name :( ");
        }
    };

    //delete a file
    var deleteFile = function(client){
        var filename = prompt("Delete which file?");
        if (filename.length){
            client.delete(filename, function(error,stat) {
                if (error){
                    return showError(error); // Cannot delete file :(
                }
            });
        }
        else{
            slert("Not deleting any file!");
        }
    };

});



