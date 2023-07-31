<?php
class AsaasAPI
{
    private $apiKey;
    private $apiUrl = 'https://www.asaas.com/api/v3/';
    // private $apiUrl = 'https://sandbox.asaas.com/api/v3/';

    public function __construct($apiKey)
    {
        $this->apiKey = $apiKey;
    }

    public function sendRequest($method, $endpoint, $data = array())
    {
        $url = $this->apiUrl . $endpoint;

        $headers = array(
            'Content-Type: application/json',
            'Access-Token: ' . $this->apiKey
        );

        $options = array(
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST => $method,
            CURLOPT_HTTPHEADER => $headers
        );

        if ($method === 'POST' || $method === 'PUT') {
            $options[CURLOPT_POSTFIELDS] = json_encode($data);
        }

        $curl = curl_init();
        curl_setopt_array($curl, $options);
        $response = curl_exec($curl);
        curl_close($curl);

        return json_decode($response, true);
    }
    // #################################################################
    // ################ MÉTODOS PARA CLIENTES ##########################
    // #################################################################

    // CRIAR UM CLIENTE
    public function createCustomer($name, $email, $phone, $mobilePhone, $cpfCnpj, $postalCode, $address, $addressNumber, $complement, $province, $city, $state, $notificationDisabled, $observations)   
    {
        $endpoint = 'customers';

        $data = array(
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'mobilePhone' => $mobilePhone,
            'cpfCnpj' => $cpfCnpj,
            'postalCode' => $postalCode,
            'address' => $address,
            'addressNumber' => $addressNumber,
            'complement' => $complement,
            'province' => $province,
            'city' => $city,
            'state' => $state,
            'notificationDisabled' => $notificationDisabled,
            'observations' => $observations
        );

        return $this->sendRequest('POST', $endpoint, $data);
    }

    // ATUALIZAR UM CLIENTE
    public function updateCustomer($customerID, $name, $email, $mobilePhone, $cpfCnpj, $postalCode, $address, $addressNumber, $complement, $province, $city, $state, $externalReference, $notificationDisabled)
    {
        $endpoint = 'customers/' . $customerID;

        $data = array(
            'name' => $name,
            'email' => $email,
            'mobilePhone' => $mobilePhone,
            'cpfCnpj' => $cpfCnpj,
            'postalCode' => $postalCode,
            'address' => $address,
            'addressNumber' => $addressNumber,
            'complement' => $complement,
            'province' => $province,
            'city' => $city,
            'state' => $state,
            'externalReference' => $externalReference,
            'notificationDisabled' => $notificationDisabled,
        );


        return $this->sendRequest('POST', $endpoint, $data);
    }


    // OBTENHA UM CLIENTE
    public function getCustomer($customerID)
    {
        $endpoint = 'customers/' . $customerID;

        return $this->sendRequest('GET', $endpoint);
    }

    //  OBTER UM CLIENTE POR CPF/CNPJ
    public function getCustomerByCpfCnpj($cpfCnpj)
    {
        $endpoint = 'customers?cpfCnpj=' . $cpfCnpj;

        return $this->sendRequest('GET', $endpoint);
    }

    // LISTAR TODOS OS CLIENTES
    public function listCustomers($offset, $limit)
    {
        $endpoint = 'customers?offset=' . $offset . '&limit=' . $limit;

        return $this->sendRequest('GET', $endpoint);
    }

    // RESTAURAR UM CLIENTE
    public function restoreCustomer($customerID)
    {
        $endpoint = 'customers/' . $customerID . '/restore';

        return $this->sendRequest('POST', $endpoint);
    }

    // EXCLUIR UM CLIENTE
    public function deleteCustomer($customerID)
    {
        $endpoint = 'customers/' . $customerID;

        return $this->sendRequest('DELETE', $endpoint);
    }
    // ##################################################################

    // #################################################################
    // ################ MÉTODOS PARA COBRANÇA ##########################
    // #################################################################

    // CRIAR UMA COBRANÇA
    public function createCharge($customerID, $dueDate, $value, $paymentMethod, $cpfCnpj, $description, $externalReference, $canBePaidAfterDueDate, $discountValue, $discountDueDateLimit, $fineValue, $interestValue, $postalService)
    {
        $endpoint = 'payments';

        $data = array(
            'customer' => $customerID,
            'billingType' => $paymentMethod,
            'dueDate' => $dueDate,
            'value' => $value,
            'description' => $description,
            'externalReference' => $externalReference,
            "canBePaidAfterDueDate" => $canBePaidAfterDueDate,
            'discount' => array(
                'value' => $discountValue,
                'dueDateLimitDays' => $discountDueDateLimit
            ),
            'fine' => array(
                'value' => $fineValue
            ),
            'interest' => array(
                'value' => $interestValue
            ),
            'postalService' => $postalService
        );

        return $this->sendRequest('POST', $endpoint, $data);
    }

    // CRIAR COBRANÇA COM CARTÃO DE CRÉDITO
    public function createCreditCardCharge($customerID, $dueDate, $value, $description, $externalReference, $holderName, $number, $expiryMonth, $expiryYear, $ccv, $name, $email, $cpfCnpj, $postalCode, $addressNumber, $addressComplement, $phone, $mobilePhone, $creditCardToken, $remoteIp)
    {
        $endpoint = 'payments';

        $data = array(
            'customer' => $customerID,
            'billingType' => 'CREDIT_CARD',
            'dueDate' => $dueDate,
            'value' => $value,
            'description' => $description,
            'externalReference' => $externalReference,
            'billingType' => 'CREDIT_CARD',
            'creditCard' => array(
                'holderName' => $holderName,
                'number' => $number,
                'expiryMonth' => $expiryMonth,
                'expiryYear' => $expiryYear,
                'ccv' => $ccv,
            ),
            'creditCardHolderInfo' => array(
                'name' => $name,
                'email' => $email,
                'cpfCnpj' => $cpfCnpj,
                'postalCode' => $postalCode,
                'addressNumber' => $addressNumber,
                'addressComplement' => $addressComplement,
                'phone' => $phone,
                'mobilePhone' => $mobilePhone,
            ),
            'creditCardToken' => $creditCardToken,
            'remoteIp' => $remoteIp,
        );

        return $this->sendRequest('POST', $endpoint, $data);
    }

    // CRIAR COBRANÇA PARCELADA
    public function createInstallmentCharge($customerID, $dueDate, $value, $billingType, $description, $externalReference, $installmentCount, $installmentValue, $totalValue, $canBePaidAfterDueDate, $discountValue, $discountDueDateLimit, $fineValue, $interestValue, $postalService)
    {
        $endpoint = 'payments';

        $data = array(
            'customer' => $customerID,
            'billingType' => $billingType,
            'dueDate' => $dueDate,
            'value' => $value,
            'description' => $description,
            'externalReference' => $externalReference,
            "canBePaidAfterDueDate" => $canBePaidAfterDueDate,
            'discount' => array(
                'value' => $discountValue,
                'dueDateLimitDays' => $discountDueDateLimit
            ),
            'fine' => array(
                'value' => $fineValue
            ),
            'interest' => array(
                'value' => $interestValue
            ),
            'postalService' => $postalService,
            'installmentCount' => $installmentCount,
            'installmentValue' => $installmentValue,
            'totalValue' => $totalValue,
        );

        return $this->sendRequest('POST', $endpoint, $data);
    }

    // RECUPERAR COBRANÇA ÚNICA
    public function getCharge($chargeID)
    {
        $endpoint = 'payments/' . $chargeID;

        return $this->sendRequest('GET', $endpoint);
    }

    // RECUPERAR COBRANÇAS
    public function listCharges($offset,$limit, $customer, $billingType, $status, $createdDateInicial, $createdDateFinal, $dueDateInicial, $dueDateFinal, $receivedDateInicial, $receivedDateFinal)
    {
        $endpoint = 'payments?' . 'offset=' . $offset . '&limit=' . $limit;
    
        if(!empty($customer)) {
            $endpoint .= '&customer=' . $customer;
        }
        if(!empty($billingType)) {
            $endpoint .= '&billingType=' . $billingType;
        }
        if(!empty($status)) {
            $endpoint .= '&status=' . $status;
        }
        if(!empty($createdDateInicial)) {
            $endpoint .= '&dateCreated%5Bge%5D=' . $createdDateInicial;
        }
        if(!empty($createdDateFinal)) {
            $endpoint .= '&dateCreated%5Ble%5D=' . $createdDateFinal;
        }
        if(!empty($dueDateInicial)) {
            $endpoint .= '&dueDate%5Bge%5D=' . $dueDateInicial;
        }
        if(!empty($dueDateFinal)) {
            $endpoint .= '&dueDate%5Ble%5D=' . $dueDateFinal;
        }
        if(!empty($receivedDateInicial)) {
            $endpoint .= '&paymentDate%5Bge%5D=' . $receivedDateInicial;
        }
        if(!empty($receivedDateFinal)) {
            $endpoint .= '&paymentDate%5Ble%5D=' . $receivedDateFinal;
        }
    
        return $this->sendRequest('GET', $endpoint);
    }
    

        // RECUPERAR COBRANÇAS
        public function listCharges2($offset,$limit)
        {
            $endpoint = 'payments?' . 'offset=' . $offset . '&limit=' . $limit;
    
            return $this->sendRequest('GET', $endpoint);
        }

    // ATUALIZAR COBRANÇA EXISTENTE
    public function updateCharge($chargeID, $billingType, $dueDate, $value, $description, $externalReference, $canBePaidAfterDueDate, $discountValue, $discountDueDateLimit, $fineValue, $interestValue, $postalService)
    {
        $endpoint = 'payments/' . $chargeID;

        $data = array(
            'billingType' => $billingType,
            'dueDate' => $dueDate,
            'value' => $value,
            'description' => $description,
            'externalReference' => $externalReference,
            "canBePaidAfterDueDate" => $canBePaidAfterDueDate,
            'discount' => array(
                'value' => $discountValue,
                'dueDateLimitDays' => $discountDueDateLimit
            ),
            'fine' => array(
                'value' => $fineValue
            ),
            'interest' => array(
                'value' => $interestValue
            ),
            'postalService' => $postalService
        );

        return $this->sendRequest('PUT', $endpoint, $data);
    }

    // REMOVER COBRANÇA
    public function deleteCharge($chargeID)
    {
        $endpoint = 'payments/' . $chargeID;

        return $this->sendRequest('DELETE', $endpoint);
    }

    // RESTAURAR COBRANÇA REMOVIDA
    public function restoreCharge($chargeID)
    {
        $endpoint = 'payments/' . $chargeID . '/restore';

        return $this->sendRequest('POST', $endpoint);
    }

    //ESTORNAR COBRANÇA
    public function refundCharge($chargeID, $value, $description)
    {
        $endpoint = 'payments/' . $chargeID . '/refund';

        $data = array(
            'value' => $value,
            'description' => $description
        );

        return $this->sendRequest('POST', $endpoint, $data);
    }

    // OBTER QR CODE PARA PAGAMENTO PIX
    public function getQrCode($chargeID)
    {
        $endpoint = 'payments/' . $chargeID . '/pixQrCode';

        return $this->sendRequest('GET', $endpoint);
    }

    // OBTER LINHA DIGITÁVEL DO BOLETO
    public function getDigitableLine($chargeID)
    {
        $endpoint = 'payments/' . $chargeID . '/identificationField';

        return $this->sendRequest('GET', $endpoint);
    }

    // CRIAR NOVA ASSINATURA
    public function createSubscription($customerID, $billingType, $nextDueDate, $value, $cycle, $description, $externalReference, $discount, $fine, $interest, $postalService, $creditCard, $creditCardHolderInfo)
    {
        $endpoint = 'subscriptions';

        $data = array(
            'customer' => $customerID,
            'billingType' => $billingType,
            'nextDueDate' => $nextDueDate,
            'value' => $value,
            'cycle' => $cycle,
            'description' => $description,
            'externalReference' => $externalReference,
            'discount' => array(
                'value' => $discount
            ),
            'fine' => array(
                'value' => $fine
            ),
            'interest' => array(
                'value' => $interest
            ),
            'sendPaymentByPostalService' => $postalService,
            'creditCard' => array(
                'holderName' => $creditCard['holderName'],
                'number' => $creditCard['number'],
                'expiryMonth' => $creditCard['expiryMonth'],
                'expiryYear' => $creditCard['expiryYear'],
                'ccv' => $creditCard['ccv'],
            ),
            'creditCardHolderInfo' => array(
                'name' => $creditCardHolderInfo['name'],
                'email' => $creditCardHolderInfo['email'],
                'cpfCnpj' => $creditCardHolderInfo['cpfCnpj'],
                'postalCode' => $creditCardHolderInfo['postalCode'],
                'addressNumber' => $creditCardHolderInfo['addressNumber'],
                'addressComplement' => $creditCardHolderInfo['addressComplement'],
                'phone' => $creditCardHolderInfo['phone'],
                'mobilePhone' => $creditCardHolderInfo['mobilePhone'],
            ),

        );

        return $this->sendRequest('POST', $endpoint, $data);
    }

    // RECUPERAR ASSINATURA
    public function getSubscription($subscriptionID)
    {
        $endpoint = 'subscriptions/' . $subscriptionID;

        return $this->sendRequest('GET', $endpoint);
    }

    // LISTAR COBRANÇAS DE UMA ASSINATURA
    public function listSubscriptionCharges($subscriptionID)
    {
        $endpoint = 'subscriptions/' . $subscriptionID . '/payments';

        return $this->sendRequest('GET', $endpoint);
    }

    // LISTAR ASSINATURAS
    public function listSubscriptions($offset, $limit)
    {
        $endpoint = 'subscriptions?' . 'offset=' . $offset . '&limit=' . $limit;

        return $this->sendRequest('GET', $endpoint);
    }

     // LISTAR ASSINATURAS COM O NOME DO CLIENTE
     public function listSubscriptionsWithCustomerName($offset, $limit)
{
    $subscriptions = $this->listSubscriptions($offset, $limit)['data']; // pegar a chave 'data'

    foreach ($subscriptions as &$subscription) { // note o uso de & para referenciar o array original
        $customer = $this->getCustomer($subscription['customer']);
        if (is_array($customer) && isset($customer['name'])) { // verificar se $customer é um array e possui a chave 'name'
            $subscription['customerName'] = $customer['name'];
        }
    }

    return $subscriptions;
}


    // ATUALIZAR ASSINATURA
    public function updateSubscription($subscriptionID, $billingType, $nextDueDate, $value, $cycle, $description, $externalReference, $updatePendingPayments, $discount, $fine, $interest, $postalService, $creditCard, $creditCardHolderInfo)
    {
        $endpoint = 'subscriptions/' . $subscriptionID;

        $data = array(
            'billingType' => $billingType,
            'nextDueDate' => $nextDueDate,
            'value' => $value,
            'cycle' => $cycle,
            'description' => $description,
            'externalReference' => $externalReference,
            'updatePendingPayments' => $updatePendingPayments,
            'discount' => array(
                'value' => $discount
            ),
            'fine' => array(
                'value' => $fine
            ),
            'interest' => array(
                'value' => $interest
            ),
            'postalService' => $postalService,
            'creditCard' => array(
                'holderName' => $creditCard['holderName'],
                'number' => $creditCard['number'],
                'expiryMonth' => $creditCard['expiryMonth'],
                'expiryYear' => $creditCard['expiryYear'],
                'ccv' => $creditCard['ccv'],
            ),
            'creditCardHolderInfo' => array(
                'name' => $creditCardHolderInfo['name'],
                'email' => $creditCardHolderInfo['email'],
                'cpfCnpj' => $creditCardHolderInfo['cpfCnpj'],
                'postalCode' => $creditCardHolderInfo['postalCode'],
                'addressNumber' => $creditCardHolderInfo['addressNumber'],
                'addressComplement' => $creditCardHolderInfo['addressComplement'],
                'phone' => $creditCardHolderInfo['phone'],
                'mobilePhone' => $creditCardHolderInfo['mobilePhone'],
            ),

        );

        return $this->sendRequest('PUT', $endpoint, $data);
    }


    // CANCELAR ASSINATURA
    public function cancelSubscription($subscriptionID)
    {
        $endpoint = 'subscriptions/' . $subscriptionID;

        return $this->sendRequest('DELETE', $endpoint);
    }

    // RECUPERAR SALDO DA CONTA
    public function getBalance()
    {
        $endpoint = 'finance/balance';

        return $this->sendRequest('GET', $endpoint);
    }

    // TOTAL A RECEBER
    public function getTotalToReceive()
    {
        $endpoint = 'finance/payment/statistics?status=PENDING';

        return $this->sendRequest('GET', $endpoint);
    }

    // RECUPERAR LINKS DE PAGAMENTO
    public function getPaymentLinks()
    {
        $endpoint = 'paymentLinks?active=true';

        return $this->sendRequest('GET', $endpoint);
    }

    // BUSCAR O NOME DA CIDADE PELO CÓDIGO
    public function getCityName($cityCode)
    {
        $endpoint = 'cities/' . $cityCode;

        return $this->sendRequest('GET', $endpoint);
    }
    // BUSCAR ESTATÍSTICAS DE COBRANÇA
    public function getPaymentStatistics($status, $dueDateInicial, $dueDateFinal, $receivedDateInicial, $receivedDateFinal)
    {
        if(!empty($status)) {
            $endpoint = 'finance/payment/statistics?status=' . $status;
        } else {
            $endpoint = 'finance/payment/statistics';
        }
        if(!empty($dueDateInicial)) {
            $endpoint .= '&dueDate%5Bge%5D=' . $dueDateInicial;
        }
        if(!empty($dueDateFinal)) {
            $endpoint .= '&dueDate%5Ble%5D=' . $dueDateFinal;
        }
        if(!empty($receivedDateInicial)) {
            $endpoint .= '&paymentDate%5Bge%5D=' . $receivedDateInicial;
        }
        if(!empty($receivedDateFinal)) {
            $endpoint .= '&paymentDate%5Ble%5D=' . $receivedDateFinal;
        }

        return $this->sendRequest('GET', $endpoint);
    }

// BUSCAR EXTRATO DA CONTA
public function getAccountStatement($page, $limit)
{
    $endpoint = 'financialTransactions';
    $offset = ($page - 1) * $limit;
    return $this->sendRequest('GET', $endpoint, ['offset' => $offset, 'limit' => $limit]);
}
}
