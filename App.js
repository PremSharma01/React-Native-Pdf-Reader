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


// import React from 'react';
// import {
//   StyleSheet,
//   TouchableHighlight,
//   Dimensions,
//   SafeAreaView,
//   View,
//   Text,
//   TextInput
// } from 'react-native';

// import Pdf from 'react-native-pdf';

// const WIN_WIDTH = Dimensions.get('window').width;


// export default class PDFExample extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       page: 1,
//       scale: 1,
//       numberOfPages: 0,
//       horizontal: false,
//       width: WIN_WIDTH
//     };
//     this.pdf = null;
//   }

//   prePage = () => {
//     let prePage = this.state.page > 1 ? this.state.page - 1 : 1;
//     this.pdf.setPage(prePage);
//     console.log(`prePage: ${prePage}`);
//   };

//   nextPage = () => {
//     const sum = this.state.page + this.state.search;
//     let nextPage = sum > this.state.numberOfPages ? this.state.numberOfPages : sum;
//     this.pdf.setPage(nextPage);
//     console.log(`nextPage: ${nextPage}`);
//     console.log(`sum: ${sum}`);
//   };

//   zoomOut = () => {
//     let scale = this.state.scale > 1 ? this.state.scale / 1.2 : 1;
//     this.setState({ scale: scale });
//     console.log(`zoomOut scale: ${scale}`);
//   };

//   zoomIn = () => {
//     let scale = this.state.scale * 1.2;
//     scale = scale > 3 ? 3 : scale;
//     this.setState({ scale: scale });
//     console.log(`zoomIn scale: ${scale}`);
//   };

//   switchHorizontal = () => {
//     this.setState({ horizontal: !this.state.horizontal, page: this.state.page });
//   };

//   render() {
//     let source = { uri: 'https://goalkicker.com/DotNETFrameworkBook/DotNETFrameworkNotesForProfessionals.pdf', cache: true };

//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={{ flexDirection: 'row' }}>
//           <TouchableHighlight disabled={this.state.page === 1}
//             style={this.state.page === 1 ? styles.btnDisable : styles.btn}
//             onPress={() => this.prePage()}>
//             <Text style={styles.btnText}>{'-'}</Text>
//           </TouchableHighlight>
//           <View style={styles.btnText}><Text style={styles.btnText}>Page</Text></View>
//           <View
//             style={this.state.page === this.state.numberOfPages ? styles.btnDisable : styles.btn}>
//             <TextInput
//               onChangeText={(search) => {
//                 this.setState({ search })
//               }}
//               value={this.state.search}
//               returnKeyType="search"
//               keyboardType="phone-pad"
//             />
//             <TouchableHighlight
//               disabled={this.state.page === this.state.numberOfPages}
//               style={this.state.page === this.state.numberOfPages ? styles.btnDisable : styles.btn}
//               testID="nextPage"
//               onPress={() => this.nextPage()}>
//               <Text style={styles.btnText}>{'-'}</Text>
//             </TouchableHighlight>
//           </View>
//           <TouchableHighlight disabled={this.state.scale === 1}
//             style={this.state.scale === 1 ? styles.btnDisable : styles.btn}
//             onPress={() => this.zoomOut()}>
//             <Text style={styles.btnText}>{'-'}</Text>
//           </TouchableHighlight>
//           <View style={styles.btnText}><Text style={styles.btnText}>Scale</Text></View>
//           <TouchableHighlight disabled={this.state.scale >= 3}
//             style={this.state.scale >= 3 ? styles.btnDisable : styles.btn}
//             onPress={() => this.zoomIn()}>
//             <Text style={styles.btnText}>{'+'}</Text>
//           </TouchableHighlight>
//           <View style={styles.btnText}><Text style={styles.btnText}>{'Horizontal:'}</Text></View>
//           <TouchableHighlight style={styles.btn} onPress={() => this.switchHorizontal()}>
//             {!this.state.horizontal ? (<Text style={styles.btnText}>{'false'}</Text>) : (
//               <Text style={styles.btnText}>{'true'}</Text>)}
//           </TouchableHighlight>

//         </View>
//         <View style={{ flex: 1, width: this.state.width }}>
//           <Pdf ref={(pdf) => {
//             this.pdf = pdf;
//           }}
//             source={source}
//             scale={this.state.scale}
//             horizontal={this.state.horizontal}
//             onLoadComplete={(numberOfPages, filePath, { width, height }, tableContents) => {
//               this.setState({
//                 numberOfPages: numberOfPages
//               });
//               console.log(`total page count: ${numberOfPages}`);
//               console.log(tableContents);
//             }}
//             onPageChanged={(page, numberOfPages) => {
//               this.setState({
//                 page: page
//               });
//               console.log(`current page: ${page}`);
//             }}
//             onError={(error) => {
//               console.log(error);
//             }}
//             style={{ flex: 1 }}
//           />
//         </View>
//       </SafeAreaView>
//     )
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//     marginTop: 25,
//   },
//   btn: {
//     margin: 2,
//     padding: 2,
//     backgroundColor: "aqua",
//   },
//   btnDisable: {
//     margin: 2,
//     padding: 2,
//     backgroundColor: "gray",
//   },
//   btnText: {
//     margin: 2,
//     padding: 2,
//   }
// });
