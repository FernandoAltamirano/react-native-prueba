//Pregunta: Depuración de un Componente de React Native con Expo
//Se te proporciona el siguiente componente de React Native que tiene como objetivo obtener y
//mostrar una lista de elementos desde una API. El componente utiliza el flujo de trabajo administrado de Expo.
//Revisa el código a continuación e identifica los varios posibles problemas que podrían llevar a
//fallas, bloqueos o comportamientos ineficientes. Propone optimizaciones o correcciones donde sea necesario.
//
//Instrucciones:
//1. Identifica y describe dichos problemas.
//2. Sugiere modificaciones específicas al código para abordar los problemas identificados.
//3. Explica por qué cada modificación soluciona el problema.

import React, { useState, useEffect, useCallback } from "react";
import { View, FlatList, ActivityIndicator, Button, SafeAreaView } from "react-native";
import { Result } from "./types/api/result";
// EL console NO ES NECESARIO IMPORTARLO YA QUE ES UNA FUNCION GLOBAL DE JAVASCRIPT
// import console from "console";
import Item from "./components/Item";
import { PAGE_LIMIT } from "./constants/pagination";
import handlerSetItemsFromApi from "./services/fetch-items";
import { styles } from "./styles";

const ItemList = () => {
  // SE AGREGO EL RESPECTIVO TIPADO A CADA useState
  const [items, setItems] = useState<Result[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    // SE EXTRAJO LA PETICION DEL API A UNA FUNCION SERVICE DENTRO DEL DIRECTORIO "./services/fetch-items.ts" PARA DE ESTA MANERA TENER UNA MEJOR ORGANIZACION DEL CODIGO
    handlerSetItemsFromApi({ page, setItems, setLoading });
    // SE MODIFICO EL PARAMETRO DEL useEffect QUE HACE EL LLAMADO FETCH YA QUE EL ANTERIOR CAUSABA UN BUCLE INFINITO. DE ESTA NUEVA MANERA SE HARA UN LLAMADO AL API SOLO CUANDO SE SOLICITE UNA NUEVA PAGINA
  }, [page]);

  // SE MODIFICO LA FUNCION PARA QUE UNICAMENTE RETORNE UN SOLO ELEMENTO
  // SE AGREGO UN useCallback PARA EVITAR RECONSTRUCCIONES INNECESARIAS DE LA FUNCION
  const renderItem = useCallback(({ item }: { item: Result }) => <Item itm={item} />, []);

  const handleLoadMore = () => {
    if (page < PAGE_LIMIT) {
      // SE MODIFICO LA FORMA DE MANEJAR EL setPage HACIENDO USO DE UNA FUNCION CALLBACK YA QUE EL NUEVO ESTADO DEPENDE DIRECTAMENTE DEL ESTADO ANTERIOR, DE ESTA FORMA EVITAMOS POSIBLES ERRORES DE ASINCRONIA
      setPage(page => page + 1);
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  // EN GENERAL SE EXTRAJO LOS INLINE STYLES A UN ARCHIVO DE ESTILOS PARA TENER UNA MEJOR ORGANIZACION DEL CODIGO
  return (
    // SE AGREGO UN SafeAreaView PARA QUE EL CONTENIDO NO SE SUPERPONGA CON LA BARRA DE NOTIFICACIONES Y CAUSE UNA MALA EXPERIENCIA DE USUARIO
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.id)}
          // PARA ESTE CASO EN ESPECIFICO TOME LA DECISION DE NO HACER USO DE LA PROPIEDAD onEndReached YA QUE CONTAMOS CON UN BOTON DE "Cargar mas" PARA SOLICITAR MAS ELEMENTOS
          // onEndReached={handleLoadMore}
          // onEndReachedThreshold={0.2}
          ListFooterComponent={
            // SE MODIFICO EL USO DE "&&" POR UN TERNARIO YA QUE ListFooterComponent RECIBE UN REACT ELEMENT Y NO UN BOOLEANO
            page < PAGE_LIMIT ? (
              <Button title="Cargar Más" onPress={handleLoadMore} />
            ) : <View />
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default ItemList;
