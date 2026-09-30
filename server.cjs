// API REST simulada con json-server + reglas de negocio (login, 401, 404, 409)
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
server.use(jsonServer.defaults());
server.use(jsonServer.bodyParser);

// POST /login -> 200 {token,user} | 401
server.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  const user = router.db.get('users').find({ email, password }).value();
  if (!user) return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
  const { password: _omit, ...safeUser } = user;
  res.json({ token: `fake-jwt-${user.id}`, user: safeUser });
});

// PATCH /appointments/:id -> valida existencia (404) y choque de horario del médico (409)
server.patch('/appointments/:id', (req, res, next) => {
  const id = Number(req.params.id);
  const current = router.db.get('appointments').find({ id }).value();
  if (!current) return res.status(404).json({ message: 'La cita no existe' });
  const { date, time } = req.body || {};
  if (date && time) {
    const clash = router.db.get('appointments').find(
      (a) => a.id !== id && a.doctor === current.doctor && a.date === date &&
             a.time === time && a.status !== 'cancelada').value();
    if (clash) return res.status(409).json({ message: 'El médico ya tiene una cita en ese horario' });
  }
  next();
});

server.use(router);
server.listen(3001, () => console.log('API en http://localhost:3001'));
