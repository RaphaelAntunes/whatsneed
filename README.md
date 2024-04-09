#WhatsNeed

**AVISO**:
Version VPS Recomendation: Ubuntu 22.04

## SETUP
Atualize o Sistema
```bash
apt update && apt upgrade
```
Crie um usuario Deploy e adicione permissões de **SUPER SU**
```bash
adduser deploy
usermod -aG sudo deploy
```
Utilize o comando para baixar e executar o instalador
```bash
sudo apt install -y git && git clone https://github.com/tonnybarros/instalador.git instalador && sudo chmod -R 777 ./instalador && cd ./instalador && sudo ./install_primaria
```
Prossiga com a instalação e Indique esse repositorio como o do projeto
```bash
https://github.com/RaphaelAntunes/Whatsneed
```
## POSSIVEL PROBLEMA EM PRIMEIRA INSTALAÇÃO
Se pedir e atualizar o KARNEL o processo vai travar, utilize CRTL + C para interromper o bash, ou outro terminal para REBOOT no server.

Remova o Instalador e a Pasta que foi criada para instalação do CRM (**VERIFIQUE OS DIRETORIOS**)

```bash
rm -r /home/deploy/whatsneed/
rm -r /root/instalador
```
Repita o processo de instalação do Instalador e siga os passos normalmente

```bash
sudo apt install -y git && git clone https://github.com/tonnybarros/instalador.git instalador && sudo chmod -R 777 ./instalador && cd ./instalador && sudo ./install_primaria
```

## Continue o SETUP

Verifique se o Postgres foi instalado
```bash
docker ps -a
``` 
Se não instale com docker no comando
```bash
docker run --name postgresql -e POSTGRES_USER=whatsneed -e POSTGRES_PASSWORD=WhatsND2024@@ -p 5432:5432 -v /data:/var/lib/postgresql/data3 -d postgres
``` 

Verifique o arquivo .env do backend e garanta que as configurações de DB estão semelhantes a essas 
```bash
DB_HOST=localhost
DB_PORT=5432
DB_DIALECT=postgres
DB_USER=whatsneed
DB_PASS=WhatsND2024@@
DB_NAME=whatsneed
``` 
Salve o arquivo do banco **whatsneed.sql** na raiz do backend e use o comando clonar ele pro docker  
```bash
docker cp /home/deploy/whatsneedcrm/backend/whatsneed.sql) ID_DO_CONTAINER(comando docker ps):
``` 

Agora importe o banco de dados 
```bash
docker exec -it ID_DO_CONTAINER pg_restore -d whatsneed -U whatsneedcrm -h localhost -p 5432 /whatsneed.sql )
´´´


