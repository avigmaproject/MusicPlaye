import React, {Component} from 'react';
import {Text, View, FlatList, TouchableOpacity, Image} from 'react-native';
import database from '@react-native-firebase/database';
// import SoundPlayer from 'react-native-sound-player'
import TrackPlayer from 'react-native-track-player';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';

let itemsRef = database().ref('songs');

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      songs: [],
      url: '',
    };
  }

  componentDidMount = async () => {
    auth()
      .signInAnonymously()
      .then(() => {
        console.log('User signed in anonymously');
      })
      .catch(error => {
        if (error.code === 'auth/operation-not-allowed') {
          console.log('Enable anonymous in your firebase console.');
        }

        console.error(error);
      });
    itemsRef.on('value', snapshot => {
      let data = snapshot.val();
      this.setState({
        songs: data,
      });
      console.log('snapshot', snapshot);
    });
  };
  onPress = async song => {
    await TrackPlayer.reset();
    const url = await storage().ref(song).getDownloadURL();
    console.log('urlurlurl', url);
    const track3 = {
      url: url,
      //url: "http://soundbible.com/mp3/Tyrannosaurus%20Rex%20Roar-SoundBible.com-807702404.mp3", // Load media from the file system
      // title: 'Ice Age',
      // artist: 'deadmau5',
      // Load artwork from the file system:
      // artwork: 'file:///storage/sdcard0/Downloads/cover.png',
      // duration: 411
    };
    console.log(track3);
    // You can then [add](https://react-native-track-player.js.org/react-native-track-player/documentation/#addtracks-insertbeforeindex) the items to the queue
    await TrackPlayer.add(track3);
    await TrackPlayer.play();
  };
  render() {
    return (
      <View>
        <FlatList
          data={this.state.songs}
          ItemSeparatorComponent={() => {
            return <View style={{borderBottomWidth: 1, BorderColor: 'pink'}} />;
          }}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                onPress={() => this.onPress(item.fullname)}
                style={{flexDirection: 'row', marginTop: 10}}>
                <View>
                  <Image
                    style={{height: 50, width: 50}}
                    source={{
                      uri: item.Image,
                    }}
                  />
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                    backgroundColor: 'pink',
                    width: '90%',
                    alignItems: 'center',
                  }}>
                  <Text>{item.Name}</Text>
                  <Text>{item.ID}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
          keyExtractor={item => item.ID}
        />
      </View>
    );
  }
}
