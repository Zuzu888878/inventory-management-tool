import { useState } from 'react'
import './App.css'

function App() {
    const [password, setPassword] = useState('')

    const hasLength = password.length >= 8
    const hasUpper = /[A-Z]/.test(password)
    const hasLower = /[a-z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    const isValid =
        hasLength &&
        hasUpper &&
        hasLower &&
        hasNumber &&
        hasSpecial

    return (
        <div>
            <input
                type="password"
                id="password"
                placeholder="Passwort"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <p id="feedback">
                {isValid ? (
                    <span style={{ color: 'green' }}>
            ✓ Passwort erfüllt alle Anforderungen
          </span>
                ) : (
                    <span style={{ color: 'red' }}>
            Anforderungen:
            <br />
                        {hasLength ? '✓' : '✗'} Mindestens 8 Zeichen
            <br />
                        {hasUpper ? '✓' : '✗'} Großbuchstabe
            <br />
                        {hasLower ? '✓' : '✗'} Kleinbuchstabe
            <br />
                        {hasNumber ? '✓' : '✗'} Zahl
            <br />
                        {hasSpecial ? '✓' : '✗'} Sonderzeichen
          </span>
                )}
            </p>
        </div>
    )
}

export default App