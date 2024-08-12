import { Card, Image } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSubmission } from "../services/submissionService";
import { toast } from "react-toastify";
import { FONT_SIZE, IMAGE_WIDTH, LINE_HEIGHT } from "../constants/constant";

export default function Submission() {
    const param = useParams()
    const [meme,setMeme] = useState()
    useEffect(() => {
        getSubmission(param.id)
         .then(res => setMeme(res.data))
         .catch(e => toast.error("Server error"))        
    },[])
    return (
        meme && <Card
            styles={{ body: { padding: 0 } }}
            style={{
              width: IMAGE_WIDTH,
              position: "relative",
              overflow: "hidden",
              borderRadius: 0,
            }}
            bordered={false}
          >
            <Image src={meme.image} alt="meme-img" preview={false} />
            <div
              style={{
                position: "absolute",
                top: `${meme.y}px`,
                left: `${meme.x}px`,
                color: `${meme.color}`,
                fontSize: `${FONT_SIZE}px`,
                fontWeight: "bold",
                lineHeight: `${LINE_HEIGHT}px`,
                width: "100%",
              }}
            >
              {meme.caption}
            </div>
          </Card>
    )
}
