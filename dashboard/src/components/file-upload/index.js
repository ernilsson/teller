import './styles.scss'

const FileUpload = ({ id, onFileChange, file }) => {
    console.log(file)
    return (
        <div className="file-upload">
            <p className="file-upload__name">{!!file ? file.name : ""}</p>
            <label htmlFor={id} className="file-upload__label">
                <p>Choose a file</p>
            </label>
            <input type="file" id={id} className="file-upload__input" onChange={e => onFileChange(e.target.files[0])}/>
        </div>
    )
}

export default FileUpload