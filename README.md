# BookmarkCollector
Hierbei handelt es sich um eine einfache Webanwendung, die im Rahmen einer Studienleistung erstellt wurde.
 
Die Vorgaben lauteten dabei wie folgt: 
  1. Verwenden Sie Node.jsund Express.js.
  2. Die Webanwendung soll eine Benutzerverwaltung mit Datenbank verwenden. 
  3. Sie dürfen keine schwergewichtigen Frameworks (z.B. Wordpress) verwenden.

# Anleitung 
1. Installiere node.js: https://nodejs.org/en/
2. Download der command-line-sqlite3-tools: https://sqlite.org/download.html
3. Entpacken des komprimierten Ordners und anschließendes Anlegen als Umgebungsvariable: Dafür der Path Variable den Pfad zu dem entpackten Ordner hinzufügen
4. Repository clonen oder herunterladen, in einer IDE (z.B. VS Code) öffnen
5. Terminal öffnen und sicherstellen, dass du dich im Projektordner befindest
6. Folgende Befehle nacheinander ausführen und ggf. mit Enter bestätigen
   npm init
   npm install 
   npm install express --save
   npm install body-parser --save 
   npm install ejs --save
   npm install sqlite3 --save
   npm install bcrypt --save
   npm install cookie-parser --save
   npm install express-session --save
   npm install express-fileupload --save
7. ggf. Module updaten: npm audit fix und npm fund
8. Du bist startklar! Starte den Server mit node server.js
9. Öffne deinen Browser navigiere auf folgende Seite: http://localhost:3000/start
10. Viel Spaß!

Wer nodemon(Server Monitoring) benutzen möchte, kann zusätzlich noch folgendes Kommando ausführen: npm install -g nodemon und den Server dann starten mit nodemon server.js

# Troubleshooting nodemon
Beim Versuch nodemon zu starten, kann es auf Windows-Rechnern dazu kommen, dass ein Sicherheitsfehler im Terminal von VS Code ausgegeben wird.
'nodemon: Die Datei "…\npm\nodemon.ps1" kann nicht geladen werden, da die Ausführung von Skripts auf diesem System deaktiviert ist. […]'

Es handelt sich hierbei um ein Rechteproblem, das in den meisten Fällen wie folgt gelöst werden sollte*:
1. Visual Studio Code beenden und anschließend als Administratorausführen.(Rechtsklick auf „Visual Studio Code“ und die entsprechende Option auswählen; alternativ Windows PowerShell als Administrator ausführen)
2. Im Terminal von Visual Studio Code folgenden Befehl eingeben: Set-ExecutionPolicy RemoteSigned –Scope CurrentUser
3. nodemon sollte sich nun wie gewünscht starten lassen. Zukünftig muss VS Code auch nicht jedes Mal als Adminstratorausgeführt werden.
   
* Lösung von https://stackoverflow.com/questions/37700536/visual-studio-code-terminal-how-to-run-a-command-with-administrator-rights/63084419#answer-63084419(Zugriff am 25.03.2021, 16:31 Uhr);und https://stackoverflow.com/questions/63423584/how-to-fix-error-nodemon-ps1-cannot-be-loaded-because-running-scripts-is-disabl#answer-63424744(Zugriff am 17.04.2021, 16:32 Uhr)
   
