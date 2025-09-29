# 🚀 **Plano de Implementação - NaHora! Marketplace**

## Fase 1: Atualização do Sistema de Precificação (IMPLEMENTAR AGORA)

### 1.1 Atualizar pricing.js
```javascript
// Nova configuração proposta
export const PRICING_CONFIG = {
  basePrice: 8.00,        // Aumento de R$ 2,00 (era 6,00)
  perKmPrice: 1.50,       // Mantém R$ 1,50/km
  platformFee: 0.15,      // 15% para plataforma
  peakHourMultiplier: 1.10, // +10% no horário de pico
  urgentFee: 2.00,        // Taxa para entrega urgente
  fragileFee: 2.00,       // Taxa para itens frágeis
  thermalFee: 2.00,       // Taxa para baú térmico
};

// Novos multiplicadores por categoria
export const CATEGORY_MULTIPLIERS = {
  small: 1.0,    // Pequeno: x1,0
  medium: 1.5,   // Médio: x1,5  
  large: 2.0     // Grande: x2,0
};
```

### 1.2 Atualizar função de cálculo
```javascript
export const calculateDeliveryPrice = ({
  distance,
  category = 'medium', // Mudança de packageType para category
  isPeakHour = false,
  isUrgent = false,
  isFragile = false,
  isThermal = false,
  products = []
}) => {
  let totalPrice = 0;
  
  // 1. Preço base por distância
  const basePrice = calculateBasePrice(distance);
  totalPrice += basePrice;
  
  // 2. Multiplicador da categoria (NOVO)
  const categoryMultiplier = CATEGORY_MULTIPLIERS[category] || 1.0;
  totalPrice *= categoryMultiplier;
  
  // 3. Taxas especiais
  if (isFragile) totalPrice += PRICING_CONFIG.fragileFee;
  if (isThermal) totalPrice += PRICING_CONFIG.thermalFee;
  if (isUrgent) totalPrice += PRICING_CONFIG.urgentFee;
  
  // 4. Horário de pico
  if (isPeakHour) totalPrice *= PRICING_CONFIG.peakHourMultiplier;
  
  // 5. Preço dos produtos (se houver)
  const productsPrice = products.reduce((total, product) => total + (product.price || 0), 0);
  
  // 6. Cálculo da taxa da plataforma (NOVO)
  const platformFee = totalPrice * PRICING_CONFIG.platformFee;
  const driverEarnings = totalPrice - platformFee;
  
  return {
    basePrice,
    categoryMultiplier,
    specialFees: {
      fragile: isFragile ? PRICING_CONFIG.fragileFee : 0,
      thermal: isThermal ? PRICING_CONFIG.thermalFee : 0,
      urgent: isUrgent ? PRICING_CONFIG.urgentFee : 0,
      peakHour: isPeakHour ? (totalPrice * (PRICING_CONFIG.peakHourMultiplier - 1)) : 0
    },
    productsPrice,
    deliveryPrice: Math.round(totalPrice * 100) / 100,
    totalPrice: Math.round((totalPrice + productsPrice) * 100) / 100,
    // NOVOS CAMPOS
    platformFee: Math.round(platformFee * 100) / 100,
    driverEarnings: Math.round(driverEarnings * 100) / 100
  };
};
```

## Fase 2: Sistema de Entregadores (PRÓXIMA SEMANA)

### 2.1 Expandir modelo Courier.js
```javascript
const courierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  cpf: { type: String, required: true },
  vehicleType: { 
    type: String, 
    enum: ['bike', 'moto', 'car', 'truck', 'walking'],
    required: true 
  },
  vehicleInfo: {
    model: String,
    plate: String,
    color: String
  },
  isAvailable: { type: Boolean, default: true },
  isOnline: { type: Boolean, default: false },
  rating: { type: Number, default: 5.0 },
  totalDeliveries: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  location: {
    lat: { type: Number },
    lng: { type: Number },
    lastUpdate: { type: Date }
  },
  bankAccount: {
    bank: String,
    agency: String,
    account: String,
    accountType: String
  },
  documents: {
    cnh: String,
    crlv: String,
    insurance: String
  },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now }
});
```

### 2.2 Criar interface para entregadores
- Página de cadastro de entregadores
- Dashboard para entregadores
- Sistema de avaliações
- Histórico de entregas

## Fase 3: Sistema de Pagamentos (2-3 SEMANAS)

### 3.1 Integração com gateway de pagamento
```javascript
// Exemplo com Stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (amount, currency = 'brl') => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Converter para centavos
    currency,
    automatic_payment_methods: {
      enabled: true,
    },
  });
  return paymentIntent;
};
```

### 3.2 Sistema de repasse automático
```javascript
const transferToDriver = async (driverId, amount) => {
  const driver = await Courier.findById(driverId);
  if (!driver.bankAccount) {
    throw new Error('Conta bancária não configurada');
  }
  
  // Implementar transferência via PIX ou TED
  const transfer = await createBankTransfer({
    amount,
    bankAccount: driver.bankAccount
  });
  
  return transfer;
};
```

## Fase 4: Notificações SMS (1 SEMANA)

### 4.1 Integração com Twilio
```javascript
const twilio = require('twilio');
const client = twilio(accountSid, authToken);

const sendSMS = async (to, message) => {
  try {
    const message = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    });
    return message.sid;
  } catch (error) {
    console.error('Erro ao enviar SMS:', error);
    throw error;
  }
};
```

### 4.2 Templates de mensagens
```javascript
const SMS_TEMPLATES = {
  deliveryCreated: (customerName, estimatedTime) => 
    `Olá ${customerName}! Sua entrega foi criada e será entregue em aproximadamente ${estimatedTime} minutos.`,
  
  deliveryAccepted: (customerName, driverName) => 
    `Olá ${customerName}! ${driverName} aceitou sua entrega e está a caminho.`,
  
  deliveryCompleted: (customerName) => 
    `Olá ${customerName}! Sua entrega foi concluída com sucesso. Obrigado por usar o NaHora!`
};
```

## Fase 5: App Mobile para Entregadores

### 5.1 Funcionalidades básicas
- Login/registro
- Visualizar entregas disponíveis
- Aceitar/recusar entregas
- Navegação GPS
- Histórico de entregas
- Ganhos e pagamentos

### 5.2 Tecnologias sugeridas
- **React Native** (reutilizar conhecimento do frontend)
- **Expo** para desenvolvimento rápido
- **Google Maps API** para navegação
- **Push notifications** para novas entregas

## Cronograma de Implementação

| Semana | Fase | Atividades |
|--------|------|------------|
| 1 | Fase 1 | Atualizar sistema de precificação |
| 2-3 | Fase 2 | Sistema de entregadores (backend) |
| 4 | Fase 2 | Interface para entregadores (frontend) |
| 5-6 | Fase 3 | Sistema de pagamentos |
| 7 | Fase 4 | Notificações SMS |
| 8 | Fase 5 | App mobile (início) |
| 9-10 | Fase 5 | App mobile (finalização) |
| 11 | Testes | Testes integrados e ajustes |
| 12 | Deploy | Deploy em produção |

## Próximos Passos Imediatos

1. **Implementar Fase 1** (atualização do sistema de precificação)
2. **Testar** com dados atuais
3. **Ajustar** tarifas baseado no feedback
4. **Começar Fase 2** (sistema de entregadores)

---

**Status atual**: Pronto para implementar Fase 1
**Tempo estimado**: 1 semana para Fase 1
**Investimento**: R$ 0 (apenas desenvolvimento)
