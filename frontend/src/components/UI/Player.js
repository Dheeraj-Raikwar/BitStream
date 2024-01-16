import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Ratio } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import fluidPlayer from 'fluid-player'
const api_url = 'http://localhost:8080/api/rest/get';

const Player = () => {
    const { id, name } = useParams();
    const [videoData, setVideoData] = useState();
    const videoRef = useRef(null);
    const [playerRef, setPlayerRef] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${api_url}/${id}.mp4`);
                if (response.ok) {
                    setVideoData(await response.blob());
                }
            } catch (error) {
                console.error('Error fetching video:', error);
            }
        };
        fetchData();
    }, [id, name]);

    useEffect(() => {
        if (videoRef.current && videoData) {
            const videoUrl = URL.createObjectURL(videoData);
            videoRef.current.src = videoUrl;
            if (!playerRef) {
                // Set playerRef to videoRef to indicate that the player is associated with this element
                setPlayerRef(videoRef);
                // Initialize fluidPlayer on the current videoRef
                fluidPlayer(videoRef.current, {});
            }
        }
    }, [videoData]);

    return (
        <div id='player'>
            <div>
                <Ratio>
                    <video ref={videoRef} controls muted autoPlay
                        style={{
                            height: '690px',
                            width: '1226px'
                        }}
                    >
                        {/* Directly use <source> element */}
                        <source type="video/mp4" />
                    </video>
                </Ratio>
            </div>
            <h1>{name}</h1>
        </div>
    );
};

export default Player;