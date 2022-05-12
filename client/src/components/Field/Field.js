const Field = ({ field, loading, onChangeHandler, onSaveHandler }) => {
    if (!field) {
        return null
    }

    return (
        <div className="input-field col s6">
            {field.type === 'button' && field.actionType === 'save' ? (
                <button
                    className="waves-effect waves-light btn-small"
                    onClick={onSaveHandler}
                    disabled={loading}
                >
                    {field.label}
                </button>
            ) : (
                <>
                    <input
                        id={field.name}
                        name={field.name}
                        type={field.type}
                        onChange={onChangeHandler}
                    />

                    <label
                        htmlFor={field.name}
                        className="active"
                    >
                        {field.label}
                    </label>
                </>
            )}
        </div>
    )
}

export default Field