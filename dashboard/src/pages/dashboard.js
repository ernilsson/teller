import FileUpload from "../components/file-upload";
import {useState} from "react";

const Dashboard = () => {
    const [story, setStory] = useState()

    return (
        <main>
            <FileUpload id="story" file={story} onFileChange={setStory}/>
        </main>
    )
}

export default Dashboard