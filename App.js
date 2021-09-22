import React from 'react';
import { StyleSheet, Dimensions, View, Button, Text, TextInput, FlatList } from 'react-native';
import Slider from '@react-native-community/slider';
import Pdf from 'react-native-pdf';
import { ProgressView } from "@react-native-community/progress-view";

// pdf uri
const source = { uri: 'https://books.goalkicker.com/ReactNativeBook/ReactNativeNotesForProfessionals.pdf', cache: true };

export default class PDFExample extends React.Component {
  state = {

    num: 1, total: 1,
    SliderValue: 1,
    jump_num: "", progress: 0,
    book_mark: ""
  }

  // book mark ui
  renderItem = ({ item, index }) => {
    if (index !== 0) return (
      <View>
        <View style={{ flexDirection: "row", alignSelf: "center" }}>
          <Button title={"Un-Book Mark"} onPress={async () => {
            let newstr = await this.state.book_mark
            console.log(newstr)
            let array = await newstr.split(',')

            let index = await array.indexOf(item.toString())
            array.splice(index, 1)

            this.setState({ book_mark: array.toString() })

          }} />
          <View style={{ width: "10%" }} />
          <Text style={{ alignSelf: "center" }}>{item}</Text>
          <View style={{ width: "10%" }} />
          <Button title="Jump" onPress={() => this.setState({ num: parseInt(item), show_bk: false })} />
        </View>

        <Pdf
          key={index}
          source={source}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page, numberOfPages) => {
            console.log(`current page: ${page}`);
          }}
          onError={(error) => {
            console.log(error);
          }}
          singlePage
          horizontal
          page={parseInt(item)}
          onPressLink={(uri) => {
            console.log(`Link presse: ${uri}`)
          }}
          style={styles.pdf} />
      </View>
    )
  }
  render() {
    // slider %
    const ptr_zoom = (this.state.SliderValue / 1.5 * 100).toFixed(0)

    return (
      <View style={styles.container}>
         {/* count and book mark btn */}
        {!this.state.show_bk &&
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text>Current - Total:  {this.state.num} - {this.state.total}</Text>
            <View style={{ width: "5%" }} />
            <Button title={this.state.book_mark.split(',').includes(this.state.num.toString()) ? "Un-Book Mark" : "Book Mark"} onPress={async () => {
              let newstr = await this.state.book_mark
              console.log(newstr)
              let array = await newstr.split(',')
              console.log(array);
              if (array.includes(this.state.num.toString())) {
                let index = await array.indexOf(this.state.num.toString())
                array.splice(index, 1)
              }
              else {
                array.push(this.state.num)
              }
              this.setState({ book_mark: array.toString() })

            }} />

          </View>
        }
        <View style={{ height: "2%" }} />

        {/* show pdf or book mark list */}
        <Button title={!this.state.show_bk ? "view book mark" : "View Pdf"} onPress={() => this.setState({ show_bk: !this.state.show_bk })} />
       
        {/* progress */}
        {!this.state.show_bk && <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <ProgressView
            progressTintColor="blue"
            trackTintColor="red"
            progress={this.state.progress}
            style={{ width: "85%" }}
          />
          <View style={{ width: "5%" }} />
          <Text>{parseFloat((this.state.num / this.state.total * 100).toFixed(0))}%</Text>
        </View>
        }
          {/* !this.state.show_bk ? pdf : book mark */}

        {!this.state.show_bk ? <Pdf
          source={source}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`number of pages: ${numberOfPages}`);
            this.setState({ total: numberOfPages })
          }}
          onPageChanged={(page, numberOfPages) => {
            console.log(`current page: ${page}`);
            this.setState({ num: page, total: numberOfPages, progress: parseFloat((this.state.num / this.state.total * 1).toFixed(1)) })
          }}
          onError={(error) => {
            console.log(error);
          }}
          enablePaging
          horizontal
          scale={this.state.SliderValue}
          enableRTL
          page={this.state.num}
          onPressLink={(uri) => {
            console.log(`Link presse: ${uri}`)
          }}
          style={styles.pdf} /> :
          <FlatList
            style={{ flex: 1, }}
            showsVerticalScrollIndicator={false}
            data={this.state.book_mark.split(",")}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString()}
          />


        }

        {!this.state.show_bk &&
          <>
          {/* back next,jump btn */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", alignSelf: "flex-end" }}>
              <View style={{ flexDirection: "row", alignSelf: "center" }}>
              <Button title="back" onPress={() => this.setState({ num: this.state.num - 1 })} />
                <View style={{ width: "10%" }} />
                <Text style={{ alignSelf: "center" }}>{this.state.num}</Text>
                <View style={{ width: "10%" }} />
                <Button title="next" onPress={() => this.setState({ num: this.state.num + 1 })} />
              </View>
              <View style={{ width: "3%" }} />

              <View style={{ flexDirection: "row", alignSelf: "center" }}>
                <TextInput
                  style={styles.input}
                  onChangeText={(jump_num) => { this.setState({ jump_num }) }}
                  value={this.state.jump_num}
                  placeholder="Go"
                  keyboardType="numeric"
                />
                <View style={{ width: "5%" }} />
                <Button title="jump" onPress={() => this.setState({ num: parseInt(this.state.jump_num) })} />

              </View>
            </View>

            {/* sclae */}
            <View style={{ justifyContent: "space-around", flexDirection: "row", alignSelf: "center" }}>
              <Slider
                step={0.05}
                minimumValue={0.5}
                maximumValue={1.5}
                thumbTintColor={"blue"}
                minimumTrackTintColor="blue"
                onValueChange={(ChangedValue) => this.setState({ SliderValue: ChangedValue })}
                value={this.state.SliderValue}
                style={{ width: '85%' }}
              />
              <Text>{ptr_zoom}%</Text>

            </View>
          </>

        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  input: {
    height: 40,
  },
});