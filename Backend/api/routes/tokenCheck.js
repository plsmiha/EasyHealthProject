function check(token) {
    if (!token) {
        return undefined;
    } else {
        try {
            const data = jwt.verify(token, process.env.JWT_KEY);
            return { id: data.id, role: data.role }
        } catch {
            return undefined;
        }
    }
    
}

module.exports = check;