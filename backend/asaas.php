<?php
// error_reporting(E_ALL);
// ini_set('display_errors', 1);


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Inclua a classe AsaasAPI
require_once 'api.php';
include 'variaveis_ambiente.php';

$rest_json = file_get_contents("php://input");
$_POST = json_decode($rest_json, true);

// Instancie a classe passando a chave de acesso do Asaas
$asaas = new AsaasAPI($api_key);

$param = $_GET['param'];


switch ($param) {
        // #################################################################
        // ################ MÉTODOS PARA CLIENTES ##########################
        // #################################################################
    case '1': // CRIAR UM CLIENTE ----------------------------------------
        $fields = [
            'name', 'email', 'phone', 'mobilePhone', 'cpfCnpj', 'postalCode', 'address',
            'addressNumber', 'complement', 'province', 'city', 'state', 'notificationDisabled',
            'observations'
        ];

        $data = [];
        foreach ($fields as $field) {
            $data[$field] = $_POST[$field] ?? '';
        }

        // Verifica se todos os campos obrigatórios foram preenchidos
        $required = ['name', 'email', 'mobilePhone', 'cpfCnpj', 'postalCode', 'address', 'addressNumber', 'city', 'state', 'province'];
        foreach ($required as $field) {
            if (empty($data[$field])) {
                echo json_encode(['error' => 'Todos os campos obrigatórios devem ser preenchidos.']);
                foreach ($required as $field) {
                    echo $data[$field] . "<br>";
                }
                return;
            }
        }

        $response = $asaas->createCustomer(...array_values($data));

        if (isset($response['errors'])) {
            echo json_encode(['error' => $response['errors'][0]['description']]);
            return;
        } else {
            echo json_encode(['success' => 'Cliente criado com sucesso!']);
            return;
        }

        break;
    case '2': // ATUALIZAR UM CLIENTE ------------------------------------

        $customerID = $_POST['id'];
        $name = $_POST['name'];
        $email = $_POST['email'];
        $mobilePhone = $_POST['mobilePhone'];
        $cpfCnpj = $_POST['cpfCnpj'];
        $postalCode = $_POST['postalCode'];
        $address = $_POST['address'];
        $addressNumber = $_POST['addressNumber'];
        $complement = $_POST['complement'];
        $province = $_POST['province'];
        $city = $_POST['city'];
        $state = $_POST['state'];
        $notificationDisabled = $_POST['notificationDisabled'];

        $response = $asaas->updateCustomer($customerID, $name, $email, $mobilePhone, $cpfCnpj, $postalCode, $address, $addressNumber, $complement, $province, $city, $state, $externalReference, $notificationDisabled);
        // Verifique a resposta e trate os erros, se necessário
        if (isset($response['errors'])) {
            echo 'Erro: ' . $response['errors'][0]['description'];
        } else {
            echo json_encode(['success' => 'Cliente atualizado com sucesso!']);
        }

        break;
    case '3': // BUSCAR UM CLIENTE ----------------------------------------
        $sql = "SELECT * FROM doacoes_clientes WHERE email = '" . $_POST['email'] . "'";
        $result = mysqli_query($conn, $sql);
        $row = mysqli_fetch_assoc($result);

        $customerID = $row['customer_id'];

        $response = $asaas->getCustomer($customerID);

        if (isset($response['errors'])) {
            echo 'Erro: ' . $response['errors'][0]['description'];
        } else {
            echo json_encode($response);
        }
        break;
    case '5': // LISTAR CLIENTES -------------------------------------
        // $customerID = '';
        // $response = $asaas->restoreCustomer($customerID);
        // // Verifique a resposta e trate os erros, se necessário
        // if (isset($response['errors'])) {
        //     echo 'Erro: ' . $response['errors'][0]['description'];
        // } else {
        //     echo 'Cliente restaurado com sucesso!';
        // }


        break;
    case '6': // EXCLUIR UM CLIENTE ---------------------------------------
        $customerID = '';
        $response = $asaas->deleteCustomer($customerID);
        // Verifique a resposta e trate os erros, se necessário
        if (isset($response['errors'])) {
            echo 'Erro: ' . $response['errors'][0]['description'];
        } else {
            echo 'Cliente excluído com sucesso!';
        }
        break;
        // #################################################################
        // ################ MÉTODOS PARA COBRANÇAS #########################
        // #################################################################
    case '7': // CRIAR UMA COBRANÇA --------------------------------------

        $customerID = $_POST['customerID']; // Obrigatório
        $dueDate = $_POST['dueDate']; // Obrigatório
        $value = $_POST['value']; // Obrigatório
        $paymentMethod = $_POST['paymentMethod']; // Obrigatório
        $cpfCnpj = $_POST['cpf_cnpj']; // Obrigatório
        $description = $_POST['description'];
        $externalReference = 'Cobrança criada via portal administrativo';
        $canBePaidAfterDueDate = false;
        $discountValue = '0';
        $discountDueDateLimit = '0';
        $fineValue = '0';
        $interestValue = '0';
        $postalService = $_POST['postalService'];

        // Verificar campos obrigatórios não preenchidos
        if ($customerID == '' || $dueDate == '' || $value == '' || $cpfCnpj == '' || $paymentMethod == '') {
            echo 'Erro: Preencha todos os campos obrigatórios!';
            exit;
        }
        $response = $asaas->createCharge($customerID, $dueDate, $value, $paymentMethod, $cpfCnpj, $description, $externalReference, $canBePaidAfterDueDate, $discountValue, $discountDueDateLimit, $fineValue, $interestValue, $postalService);

        if (isset($response['errors'])) {
            echo 'Erro: ' . $response['errors'][0]['description'];
        } else {
            echo json_encode($response);
        }

        break;
    case '8': // CRIAR UMA COBRANÇA COM CARTÃO DE CRÉDITO -----------------

        $customerID = 'cus_000056001794'; // Obrigatório
        $dueDate = '2023-06-15'; // Obrigatório
        $value = '5.00'; // Obrigatório
        $description = '';
        $externalReference = '';
        $holderName = 'Gabriel Gomes'; // Obrigatório
        $number = '5502099844791701'; // Obrigatório
        $expiryMonth = '08'; // Obrigatório
        $expiryYear = '27'; // Obrigatório
        $ccv = '055'; // Obrigatório
        $name = 'Gabriel Gomes'; // Obrigatório
        $email = 'gabriel.gomes@outlook.com'; // Obrigatório
        $cpfCnpj = '83029052087'; // Obrigatório
        $postalCode = '93225070'; // Obrigatório
        $addressNumber = '340'; // Obrigatório
        $addressComplement = '';
        $phone = ''; // Obrigatório
        $mobilePhone = '51992049874';
        $creditCardToken = ''; // Obrigatório
        $remoteIp = ''; // Obrigatório

        // Verificar campos obrigatórios não preenchidos
        if ($customerID == '' || $dueDate == '' || $value == '' || $holderName == '' || $number == '' || $expiryMonth == '' || $expiryYear == '' || $ccv == '' || $name == '' || $email == '' || $cpfCnpj == '' || $postalCode == '' || $addressNumber == '') {
            echo 'Erro: Preencha todos os campos obrigatórios!';
            exit;
        }

        $response = $asaas->createCreditCardCharge($customerID, $dueDate, $value, $description, $externalReference, $holderName, $number, $expiryMonth, $expiryYear, $ccv, $name, $email, $cpfCnpj, $postalCode, $addressNumber, $addressComplement, $phone, $mobilePhone, $creditCardToken, $remoteIp);
        // Verifique a resposta e trate os erros, se necessário

        if (isset($response['errors'])) {
            echo 'Erro: ' . $response['errors'][0]['description'];
        } else {
            $query = "INSERT INTO doacoes_cobranca (id_cobranca, dateCreated, customer_id, dueDate, value, netValue, billingType, canBePaidAfterDueDate, status, description, externalReference, nossoNumero, invoiceUrl, bankSlipUrl, invoiceNumber, deleted, postalService, anticipated, anticipable) VALUES ('" . $response['id'] . "', '" . $response['dateCreated'] . "', '" . $response['customer'] . "', '" . $response['dueDate'] . "', '" . $response['value'] . "', '" . $response['netValue'] . "', '" . $response['billingType'] . "', '" . $response['canBePaidAfterDueDate'] . "', '" . $response['status'] . "', '" . $response['description'] . "', '" . $response['externalReference'] . "', '" . $response['nossoNumero'] . "', '" . $response['invoiceUrl'] . "', '" . $response['bankSlipUrl'] . "', '" . $response['invoiceNumber'] . "', '" . $response['deleted'] . "', '" . $response['postalService'] . "', '" . $response['anticipated'] . "', '" . $response['anticipable'] . "')";
            $result = mysqli_query($conn, $query);
            if (!$result) {
                die("Erro ao inserir no banco de dados");
            } else {
                echo "sucess";
            }
        }
        break;
    case '9': // CRIAR COBRANÇA PARCELADA ---------------------------------
        $customerID = ''; // Obrigatório
        $dueDate = ''; // Obrigatório
        $value = '';
        $billingType = ''; // CREDIT_CARD OU BOLETO
        $description = '';
        $externalReference = '';
        $installmentCount = ''; // Obrigatório
        $installmentValue = ''; // Obrigatório ou totalValue
        $totalValue = ''; // Obrigatório ou installmentValue
        $canBePaidAfterDueDate = false;
        $discountValue = '0';
        $discountDueDateLimit = '0';
        $fineValue = '0';
        $interestValue = '0';
        $postalService = false;

        $response = $asaas->createInstallmentCharge($customerID, $dueDate, $value, $billingType, $description, $externalReference, $installmentCount, $installmentValue, $totalValue, $canBePaidAfterDueDate, $discountValue, $discountDueDateLimit, $fineValue, $interestValue, $postalService);
        if (isset($response['errors'])) {
            echo 'Erro: ' . $response['errors'][0]['description'];
        } else {
            echo 'Cobrança parcelada criada com sucesso! ID: ' . $response['id'];
        }

        break;
    case '10': // RECUPERAR COBRANÇA ÚNICA -------------------------------

        $chargeID = ''; // Obrigatório
        $response = $asaas->getCharge($chargeID);
        // Verifique a resposta e trate os erros, se necessário
        if (isset($response['errors'])) {
            echo 'Erro: ' . $response['errors'][0]['description'];
        } else {
            // Salve os dados da cobrança em seu banco de dados, para futuras consultas
            echo 'Cobrança recuperada com sucesso!';
            echo $response['id'];
        }

        break;
    case '11': // LISTAR COBRANÇAS ----------------------------------------
        $customer = $_POST['customer'];
        $billingType = $_POST['billingType'];
        $status = $_POST['status'];
        $createdDateInicial = $_POST['createdDateInicial'];
        $createdDateFinal = $_POST['createdDateFinal'];
        $dueDateInicial = $_POST['dueDateInicial'];
        $dueDateFinal = $_POST['dueDateFinal'];
        $receivedDateInicial = $_POST['receivedDateInicial'];
        $receivedDateFinal = $_POST['receivedDateFinal'];

        $offset = 0;
        $limit = 100;
        $data = [];

        // do {            
        //     $response = $asaas->listCharges($offset,$limit, $customer, $billingType, $status, $createdDateInicial, $createdDateFinal, $dueDateInicial, $dueDateFinal, $receivedDateInicial, $receivedDateFinal);
        //     // $response = $asaas->listCharges2($offset,$limit);
        //     if (isset($response['errors'])) {
        //         echo 'Erro: ' . $response['errors'][0]['description'];
        //         return;
        //     } else {
        //         $customerData = $asaas->getCustomer($response['data'][0]['customer']);
        //         $data = array_merge($data, $response['data']);                
        //         $offset += $limit;
        //     }
        // } while($response['hasMore']);

        // echo json_encode(['data' => $data]);

        do {
            $response = $asaas->listCharges($offset, $limit, $customer, $billingType, $status, $createdDateInicial, $createdDateFinal, $dueDateInicial, $dueDateFinal, $receivedDateInicial, $receivedDateFinal);

            if (isset($response['errors'])) {
                echo 'Erro: ' . $response['errors'][0]['description'];
                return;
            } else {
                foreach ($response['data'] as $key => $value) {
                    $customerData = $asaas->getCustomer($value['customer']);
                    $response['data'][$key]['customerName'] = $customerData['name'];
                    $response['data'][$key]['email'] = $customerData['email'];
                    $response['data'][$key]['phone'] = $customerData['phone'];
                    $response['data'][$key]['mobilePhone'] = $customerData['mobilePhone'];
                    $response['data'][$key]['cpfCnpj'] = $customerData['cpfCnpj'];
                }

                $data = array_merge($data, $response['data']);
                $offset += $limit;
            }
        } while ($response['hasMore']);

        echo json_encode(['data' => $data]);


        break;
    case '12': // ATUALIZAR COBRANÇA EXISTENTE ---------------------------

        $chargeID = ''; // Obrigatório
        $billingType = ''; // Obrigatório
        $dueDate = ''; // Obrigatório
        $value = ''; // Obrigatório
        $description = '';
        $externalReference = '';
        $canBePaidAfterDueDate = false;
        $discountValue = '0';
        $discountDueDateLimit = '0';
        $fineValue = '0';
        $interestValue = '0';
        $postalService = false;

        $response = $asaas->updateCharge($chargeID, $billingType, $dueDate, $value, $description, $externalReference, $canBePaidAfterDueDate, $discountValue, $discountDueDateLimit, $fineValue, $interestValue, $postalService);
        // Verifique a resposta e trate os erros, se necessário
        if (isset($response['errors'])) {
            echo 'Erro: ' . $response['errors'][0]['description'];
        } else {
            echo 'Cobrança atualizada com sucesso!';
        }

        break;
    case '13': // REMOVER COBRANÇA ----------------------------------------
        $chargeID = ''; // Obrigatório
        $response = $asaas->deleteCharge($chargeID);
        // Verifique a resposta e trate os erros, se necessário
        if (isset($response['errors'])) {
            echo 'Erro: ' . $response['errors'][0]['description'];
        } else {
            echo 'Cobrança removida com sucesso!';
        }

        break;
    case '14': // RESTAURAR COBRANÇA REMOVIDA ----------------------------
        $chargeID = ''; // Obrigatório
        $response = $asaas->restoreCharge($chargeID);
        // Verifique a resposta e trate os erros, se necessário
        if (isset($response['errors'])) {
            echo 'Erro: ' . $response['errors'][0]['description'];
        } else {
            echo 'Cobrança restaurada com sucesso!';
        }

        break;
    case '15': // ESTORNAR COBRANÇA ---------------------------------------
        $chargeID = ''; // Obrigatório
        $value = ''; // Obrigatório
        $description = '';

        $response = $asaas->refundCharge($chargeID, $value, $description);
        // Verifique a resposta e trate os erros, se necessário
        if (isset($response['errors'])) {
            echo 'Erro: ' . $response['errors'][0]['description'];
        } else {
            echo 'Cobrança estornada com sucesso!';
        }

        break;
    case '16': // OBTER QR CODE PARA PAGAMENTO PIX -------------------------
        $chargeID = ''; // Obrigatório
        $response = $asaas->getQRCode($chargeID);
        // Verifique a resposta e trate os erros, se necessário
        if (isset($response['errors'])) {
            echo 'Erro: ' . $response['errors'][0]['description'];
        } else {
            // Salve os dados do QR Code em seu banco de dados, para futuras consultas
            echo 'QR Code obtido com sucesso!<br>';
            echo $response['encodedImage'] . "<br>";
            echo $response['payload'] . "<br>";
            echo $response['expirationDate'] . "<br>";
        }

        break;
    case '17': // OBTER LINHA DIGITÁVEL -------------------------------------
        $chargeID = ''; // Obrigatório
        $response = $asaas->getDigitableLine($chargeID);
        // Verifique a resposta e trate os erros, se necessário
        if (isset($response['errors'])) {
            echo 'Erro: ' . $response['errors'][0]['description'];
        } else {
            // Salve os dados da linha digitável em seu banco de dados, para futuras consultas
            echo 'Linha digitável obtida com sucesso!<br>';
            echo $response['identificationField'] . "<br>"; // linha digitável
            echo $response['barCode'] . "<br>"; // código de barras

        }
        break;
        // #################################################################
        // ######################## ASSINATURAS ############################
        // #################################################################
    case '18': // CRIAR NOVA ASSINATURA -----------------------------------
        $customerID = $_POST['customerID']; // Obrigatório
        $billingType = 'UNDEFINED'; // Obrigatório
        $nextDueDate = $_POST['nextDueDate']; // Obrigatório
        $value = $_POST['value']; // Obrigatório
        $cycle = $_POST['cycle']; // Obrigatório (WEEKLY, BIWEEKLY, MONTHLY, QUARTERLY, SEMIANNUALLY, YEARLY)
        $description = '';
        $externalReference = '';
        $discount = '0';
        $fine = '0';
        $interest = '0';
        $postalService = false;
        $creditCard = array(
            'holderName' => '', // Obrigatório
            'number' => '', // Obrigatório
            'expiryMonth' => '', // Obrigatório
            'expiryYear' => '', // Obrigatório
            'ccv' => '', // Obrigatório
        );
        $creditCardHolderInfo = array(
            'name' => '', // Obrigatório
            'email' => '',
            'cpfCnpj' => '', // Obrigatório
            'postalCode' => '', // Obrigatório
            'addressNumber' => '', // Obrigatório
            'addressComplement' => '',
            'phone' => '', // Obrigatório
            'mobilePhone' => '', // Obrigatório
        );

        $response = $asaas->createSubscription($customerID, $billingType, $nextDueDate, $value, $cycle, $description, $externalReference, $discount, $fine, $interest, $postalService, $creditCard, $creditCardHolderInfo);
        // Verifique a resposta e trate os erros, se necessário
        if (isset($response['errors'])) {
            echo json_encode(['status' => 'error', 'message' => $response['errors'][0]['description']]);
        } else {
            echo json_encode(['status' => 'success', 'message' => 'Assinatura criada com sucesso!', 'data' => $response]);
        }

        break;
    case '19': // RECUPERAR ASSINATURA -----------------------------------------
        $subscriptionID = ''; // Obrigatório
        $response = $asaas->getSubscription($subscriptionID);
        // Verifique a resposta e trate os erros, se necessário
        if (isset($response['errors'])) {
            echo 'Erro: ' . $response['errors'][0]['description'];
        } else {
            // Salve os dados da assinatura em seu banco de dados, para futuras consultas
            echo 'Assinatura recuperada com sucesso!<br>';
            echo $response['id'] . "<br>";
            echo $response['customer'] . "<br>";
            echo $response['billingType'] . "<br>";
            echo $response['nextDueDate'] . "<br>";
            echo $response['value'] . "<br>";
            echo $response['cycle'] . "<br>";
            echo $response['status'] . "<br>";
        }

        break;
    case '20': // LISTAR COBRANÇAS DE UMA ASSINATURA --------------------------
        $subscriptionID = $_GET['id']; // Obrigatório
        $response = $asaas->listSubscriptionCharges($subscriptionID);
        // Verifique a resposta e trate os erros, se necessário
        if (isset($response['errors'])) {
            echo 'Erro: ' . $response['errors'][0]['description'];
        } else {
            echo json_encode($response);
        }
        break;
    case '21': // LISTAR ASSINATURAS ----------------------------------------
        $offset = 0;
        $limit = 100; // ou qualquer valor que o backend permita
        $data = [];

        do {
            $response = $asaas->listSubscriptionsWithCustomerName($offset, $limit);
            // Verifique a resposta e trate os erros, se necessário
            if (isset($response['errors'])) {
                echo 'Erro: ' . $response['errors'][0]['description'];
            } else {
                $data[] = $response; // Adiciona a resposta ao array $data
            }
            $offset += $limit;
        } while ($response['hasMore']);

        echo json_encode(['data' => $data]);

        break;
    case '22': // ATUALIZAR ASSINATURA ----------------------------------------
        $subscriptionID = ''; // Obrigatório
        $nextDueDate = ''; // Obrigatório
        $value = ''; // Obrigatório
        $cycle = ''; // Obrigatório (WEEKLY, BIWEEKLY, MONTHLY, QUARTERLY, SEMIANNUALLY, YEARLY)
        $description = '';
        $externalReference = '';
        $updatePendingPayments = false;
        $discount = '0';
        $fine = '0';
        $interest = '0';
        $postalService = false;
        $creditCard = array(
            'holderName' => '', // Obrigatório
            'number' => '', // Obrigatório
            'expiryMonth' => '', // Obrigatório
            'expiryYear' => '', // Obrigatório
            'ccv' => '', // Obrigatório
        );
        $creditCardHolderInfo = array(
            'name' => '', // Obrigatório
            'email' => '',
            'cpfCnpj' => '', // Obrigatório
            'postalCode' => '', // Obrigatório
            'addressNumber' => '340', // Obrigatório
            'addressComplement' => '',
            'phone' => '', // Obrigatório
            'mobilePhone' => '', // Obrigatório
        );

        $response = $asaas->updateSubscription($subscriptionID, $billingType, $nextDueDate, $value, $cycle, $description, $externalReference, $updatePendingPayments, $discount, $fine, $interest, $postalService, $creditCard, $creditCardHolderInfo);
        // Verifique a resposta e trate os erros, se necessário
        if (isset($response['errors'])) {
            echo 'Erro: ' . $response['errors'][0]['description'];
            var_dump($response);
        } else {
            // Salve os dados da assinatura em seu banco de dados, para futuras consultas
            echo 'Assinatura atualizada com sucesso!<br>';
            echo $response['id'] . "<br>";
            echo $response['customer'] . "<br>";
            echo $response['billingType'] . "<br>";
            echo $response['nextDueDate'] . "<br>";
            echo $response['value'] . "<br>";
        }
        break;
    case '23': // CANCELAR ASSINATURA ----------------------------------------
        $subscriptionID = ''; // Obrigatório
        $response = $asaas->cancelSubscription($subscriptionID);
        // Verifique a resposta e trate os erros, se necessário
        if (isset($response['errors'])) {
            echo 'Erro: ' . $response['errors'][0]['description'];
            var_dump($response);
        } else {
            // Salve os dados da assinatura em seu banco de dados, para futuras consultas
            echo 'Assinatura cancelada com sucesso!<br>';
            echo $response['id'] . "<br>";
        }
        break;
    case '24': // CRIAR COBRANÇA RECORRENTE
        // SELECIONAR DADOS DA TABELA cliente_doacao
        $sql = "SELECT * FROM cliente_doacao_link WHERE customerID IS NULL";
        $result = mysqli_query($conn, $sql);
        // mostrar json dos dados encontrados no banco de dados
        $doadores = array();
        while ($row = mysqli_fetch_assoc($result)) {
            $doadores[] = $row;
        }
        // Percorrendo o array doadores para inserir o cliente no asaas

        foreach ($doadores as $doador) {
            $name = $doador['nome'];
            $email = $doador['email'];
            $phone = $doador['telefone'];
            $mobilePhone = $doador['celular'];
            $cpfCnpj = $doador['cpf_cnpj'];
            $postalCode = $doador['cep'];
            $address = $doador['endereco'];
            $addressNumber = $doador['numero_endereco'];
            $complement = $doador['complemento'];
            $province = $doador['bairro'];
            $externalReference = $doador['id'];
            $notificationDisabled = $doador['notificacao'] == "sim" ? false : true;
            $additionalEmails = $doador['email_adicional'];
            $municipalInscription = $doador['inscricao_municipal'];
            $stateInscription = $doador['inscricao_estadual'];
            $observations = 'pagamento via link';

            $response = $asaas->createCustomer($name, $email, $phone, $mobilePhone, $cpfCnpj, $postalCode, $address, $addressNumber, $complement, $province, $externalReference, $notificationDisabled, $additionalEmails, $municipalInscription, $stateInscription, $observations);

            // if ($response['id']){
            //     $sql = "UPDATE cliente_doacao SET customerID = '{$response['id']}' WHERE id = '{$doador['id']}'";
            //     $result = mysqli_query($conn, $sql);

            // }

            // Criando assinatura

            // $customer = $response['id'];
            // $billingType = $doador['billingType'];
            // $nextDueDate = $doador['nextDueDate'];
            // $value = $doador['valor'];
            // $cycle = $doador['cycle'];
            // $description = $doador['description'];
            // $externalReference = $doador['externalReference'];
            // $discount = '0';
            // $fine = '0';
            // $interest = '0';
            // $postalService = $doador['correio'] == "sim" ? true : false;
            // $creditCard = array(
            //     'holderName' => $doador['holderName'],
            //     'number' => $doador['number'],
            //     'expiryMonth' => $doador['expiryMonth'],
            //     'expiryYear' => $doador['expiryYear'],
            //     'ccv' => $doador['ccv'],
            // );
            // $creditCardHolderInfo = array(
            //     'name' => $doador['name'],
            //     'email' => $doador['email'],
            //     'cpfCnpj' => $doador['cpfCnpj'],
            //     'postalCode' => $doador['postalCode'],
            //     'addressNumber' => $doador['addressNumber'],
            //     'addressComplement' => $doador['addressComplement'],
            //     'phone' => $doador['phone'],
            //     'mobilePhone' => $doador['mobilePhone'],
            // );

            // $response = $asaas->createSubscription($customer, $billingType, $nextDueDate, $value, $cycle, $description, $externalReference, $discount, $fine, $interest, $postalService, $creditCard, $creditCardHolderInfo);

            // // Verifique a resposta e trate os erros, se necessário

            // if (isset($response['errors'])) {
            //     echo 'Erro: ' . $response['errors'][0]['description'];                
            // } else {
            //     // Salve os dados da assinatura em seu banco de dados, para futuras consultas
            //     echo 'Assinatura criada com sucesso!<br>';
            //     echo $response['id'] . "<br>";
            //     echo $response['customer'] . "<br>";
            //     echo $response['billingType'] . "<br>";
            //     echo $response['nextDueDate'] . "<br>";
            //     echo $response['value'] . "<br>";
            //     $sql = "INSERT INTO cliente_doacao_efetivado (id_assinatura, id_customer, billingType, nextDueDate, value, date_created) VALUES ('".$response['id']."', '".$response['customer']."', '".$response['billingType']."', '".$response['nextDueDate']."', '".$response['value']."', now())";

            //     if (mysqli_query($conn, $sql)) {
            //         echo "New record created successfully";
            //     } else {
            //         echo "Error: " . $sql . "" . mysqli_error($conn);
            //     }
            // }         

        }


        break;
    case '25':
        $response = $asaas->getBalance();
        echo json_encode($response);
        break;

    case '26':
        $status = $_POST['status'];
        $dueDateInicial = isset($_POST['dueDateInicial']) ? $_POST['dueDateInicial'] : '';
        $dueDateFinal = isset($_POST['dueDateFinal']) ? $_POST['dueDateFinal'] : '';
        $receivedDateInicial = isset($_POST['receivedDateInicial']) ? $_POST['receivedDateInicial'] : '';
        $receivedDateFinal = isset($_POST['receivedDateFinal']) ? $_POST['receivedDateFinal'] : '';

        $response = $asaas->getPaymentStatistics($status, $dueDateInicial, $dueDateFinal, $receivedDateInicial, $receivedDateFinal);
        echo json_encode($response);
        break;
    case '27':
        $response = $asaas->getCustomerByCpfCnpj($_POST['cpf']);
        echo json_encode($response);
        break;
    case '28': // Recuperar links de pagamento
        $response = $asaas->getPaymentLinks();
        echo json_encode($response);
        break;
    case '29': // Listar todos os clientes

        $offset = 0;
        $limit = 100;
        $data = [];
        do {
            $response = $asaas->listCustomers($offset, $limit);
            // Verifique a resposta e trate os erros, se necessário
            if (isset($response['errors'])) {
                echo 'Erro: ' . $response['errors'][0]['description'];
            } else {
                $data = array_merge($data, $response['data']); // Adiciona os clientes ao array $data
            }
            $offset += $limit;
        } while ($response['hasMore']);

        echo json_encode(['data' => $data]);

        break;
    case '30': // Buscar o nome da cidade pelo código
        $response = $asaas->getCityName($_POST['code']);
        echo json_encode($response);
        break;
    case '31': // Listar links de pagamento

        $sql = "SELECT * FROM cliente_doacao_link";
        $result = mysqli_query($conn, $sql);

        $doadores = array();
        while ($row = mysqli_fetch_assoc($result)) {
            $doadores[] = $row;
        }
        echo json_encode($doadores);

        break;
    case '32': // Editar links de pagamento

        $id = $_POST['id'];
        $nome = $_POST['nome'];
        $bairro = $_POST['bairro'];
        $celular = $_POST['celular'];
        $cep = $_POST['cep'];
        $cidade = $_POST['cidade'];
        $complemento = $_POST['complemento'];
        $cpf_cnpj = $_POST['cpf_cnpj'];
        $email = $_POST['email'];
        $endereco = $_POST['endereco'];
        $estado = $_POST['estado'];
        $numero_endereco = $_POST['numero_endereco'];

        $sql = "UPDATE cliente_doacao_link SET 
                nome = '{$nome}', 
                bairro = '{$bairro}',
                celular = '{$celular}',
                cep = '{$cep}',
                cidade = '{$cidade}',
                complemento = '{$complemento}',
                cpf_cnpj = '{$cpf_cnpj}',
                email = '{$email}',
                endereco = '{$endereco}',
                estado = '{$estado}',
                numero_endereco = '{$numero_endereco}'
                WHERE id = '{$id}'";

        $result = mysqli_query($conn, $sql);

        if ($result) {
            echo json_encode(['success' => 'Link de pagamento editado com sucesso']);
        } else {
            echo json_encode(['error' => 'Erro ao editar link de pagamento']);
        }


        break;
    case '33': // CANCELAR LINK DE PAGAMENTO
        $id = $_GET['id'];

        $sql = "DELETE FROM cliente_doacao_link WHERE id = '{$id}'";
        $result = mysqli_query($conn, $sql);
        if ($result) {
            echo json_encode(['success' => 'Link de pagamento cancelado com sucesso']);
        } else {
            echo json_encode(['error' => 'Erro ao cancelar link de pagamento']);
        }
        break;
    case '34': // Cadastrar usuário para receber link
        $bairro = isset($_POST['bairro']) ? $_POST['bairro'] : null;
        $celular = isset($_POST['celular']) ? $_POST['celular'] : null;
        $cep = isset($_POST['cep']) ? $_POST['cep'] : null;
        $cidade = isset($_POST['cidade']) ? $_POST['cidade'] : null;
        $complemento = isset($_POST['complemento']) ? $_POST['complemento'] : null;
        $cpf_cnpj = isset($_POST['cpf_cnpj']) ? $_POST['cpf_cnpj'] : null;
        $email = isset($_POST['email']) ? $_POST['email'] : null;
        $endereco = isset($_POST['endereco']) ? $_POST['endereco'] : null;
        $estado = isset($_POST['estado']) ? $_POST['estado'] : null;
        $nome = isset($_POST['nome']) ? $_POST['nome'] : null;
        $numero_endereco = isset($_POST['numero_endereco']) ? $_POST['numero_endereco'] : null;

        $sql = "INSERT INTO cliente_doacao_link (bairro, celular, cep, cidade, complemento, cpf_cnpj, cycle, email, endereco, estado, nome, numero_endereco) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        $stmt = mysqli_prepare($conn, $sql);

        if ($stmt && ($nome != '' || $nome != null)) {
            mysqli_stmt_bind_param($stmt, "ssssssssssss", $bairro, $celular, $cep, $cidade, $complemento, $cpf_cnpj, $cycle, $email, $endereco, $estado, $nome, $numero_endereco);

            if (mysqli_stmt_execute($stmt)) {
                echo json_encode(['success' => 'Usuário cadastrado com sucesso']);
            } else {
                echo json_encode(['error' => 'Erro ao cadastrar usuário']);
            }

            mysqli_stmt_close($stmt);
        } else {
            echo "Erro ao preparar consulta: " . mysqli_error($conn);  // Exibir o erro específico
        }

        mysqli_close($conn);
        break;
    case '35': // Eventos cadastrados no banco de dados
        $sql = "SELECT ew1.*
                FROM events_webhook ew1
                INNER JOIN (
                    SELECT payment_id, MAX(id) AS maxId
                    FROM events_webhook
                    GROUP BY payment_id
                ) ew2
                ON ew1.payment_id = ew2.payment_id
                AND ew1.id = ew2.maxId
                ORDER BY ew1.paymentDate ASC
            ";

        $result = mysqli_query($conn, $sql);

        $events = array();
        while ($row = mysqli_fetch_assoc($result)) {
            $events[] = $row;
        }
        echo json_encode($events);

        break;
        case '36': // pegar extrato.
            $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
            $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10; 
            $response = $asaas->getAccountStatement($page, $limit);
            echo json_encode($response);        
            break;
    default:
        echo json_encode(['error' => 'Cidade não encontrada']);
        break;
}
