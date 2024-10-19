import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Result } from '../types/api/result'

interface Props { itm: Result }

function Item(props: Props) {
  const { itm } = props
  return (
    <View
      key={itm.id}
      style={styles.container}
    >
      <Text>{itm.name}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { borderBottomColor: "#ccc", borderBottomWidth: 1, padding: 20 }
})

export default Item