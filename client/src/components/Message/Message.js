const Message = ({ error, isSuccess }) => {
    if ((!error || !error.message) && !isSuccess) {
        return null
    }

    return (
        <div className={`card-panel lighten-2 ${isSuccess ? 'green' : 'red'}`}>
            <p className="center-align white-text">{isSuccess ? 'Success!' : error.message}</p>
        </div>
    )
}

export default Message