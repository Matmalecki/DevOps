# Notatki
IMAGE -> plik binarny w którym jest snapshot filesystemu + Proces główny kontenera
Inna usługa -> inny kontener
# Polecenia
- docker run hello-world
- docker run redis
- docker ps -> jakie mamy uruchomione kontenery
- docker stop [ID] -> zatrzymaj dany kontener
- docker system prune -> wyczyść wszystkie containery które nie są używane 
- docker images -> wyświetl wszystkie lokalnie ściągnięte image
- docker image prune -> Usuń wszystkie nieużywane image
- docker images prune --all -> Usuń wszystkie image
- docker start [ID] -> uruchom dany kontener
- docker start -a [ID] -> uruchom dany kontener z outputem
- docker exec -t [ID] sh -> uruchamia wskazany kontener w trybie edycji sh (terminal linuxowy)
- docker build . (<-kontekst do budowy img)
- docker pull IMAGE[:TAG] -> pobierz image
- docker push IMAGE[:TAG] -> wrzuć image do repozytorium
- docker run -p HOSTPORT:CONTAINERPORT IMAGE -> zacznij nowy kontener z zmapowanym portem