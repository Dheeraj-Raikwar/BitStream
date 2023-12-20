import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Ratio } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import fluidPlayer from 'fluid-player'
const api_url = 'http://localhost:8080/api/rest/get';

const Player = () => {
    const { id, name } = useParams();
    const [videoData, setVideoData] = useState();
    let self = useRef(null);
    let player = null;
    useEffect(() => {
        if (!player) {
            player = fluidPlayer(self.current, {});
        }

        const fetchData = async () => {
            try {
                let res = await axios({
                    url: api_url + '/' + id + '.mp4',
                    method: 'get',
                    timeout: 8000
                });

                if (res.status === 200) {
                    let data = res.data;
                    const CHUNK_SIZE = 1024; // Adjust the chunk size based on your requirements
                    let binaryString = '';

                    for (let i = 0; i < data.length; i += CHUNK_SIZE) {
                        binaryString += atob(data.slice(i, i + CHUNK_SIZE));
                    }

                    const byteArray = new Uint8Array(binaryString.length);

                    for (let i = 0; i < binaryString.length; i++) {
                        byteArray[i] = binaryString.charCodeAt(i);
                    }

                    const videoBlob = new Blob([byteArray], { type: 'video/mp4' });
                    const videoBlobUrl = URL.createObjectURL(videoBlob);
                    setVideoData(videoBlobUrl);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [id, name]);

    return (
        <div>
            <div>
                <Ratio aspectRatio="16x9">
                    <video ref={self}>
                        <source src={videoData}
                            type='video/mp4'/>
                    </video>
                    {/* <video controls muted autoPlay
                        src={videoData}
                        style={{
                            width: '100%',
                            height: '100%',
                            display: 'block',
                            margin: '0',
                            padding: '0',
                        }}
                    /> */}
                </Ratio>
            </div>
            <h1>{name}</h1>
        </div>
    );
};

export default Player;