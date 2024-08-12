import { Card, Image } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSubmission } from "../services/submissionService";
import { toast } from "react-toastify";
import { FONT_SIZE, IMAGE_WIDTH, LINE_HEIGHT } from "../constants/constant";

export default function Submission() {
    // Get the submission ID from the URL parameters
    const param = useParams()

    // State variable to store the meme data
    const [meme,setMeme] = useState()

    // Fetch the submission data when the component mounts
    useEffect(() => {
        getSubmission(param.id)
         // Set the meme data on successful response
         .then(res => setMeme(res.data))
         // Show error toast on failure
         .catch(e => toast.error("Server error"))        
    },[])
    return (
        // Render the meme card if meme data is available
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
