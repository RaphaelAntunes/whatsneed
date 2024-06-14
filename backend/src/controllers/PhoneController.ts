// controllerController.ts
import User from "../models/User";

const ChangeUserPhone = async (userId: number, newPhone: string): Promise<User | null> => {
  try {
    const user = await User.findByPk(userId);
    if (user) {
      user.phone = newPhone;
      await user.save();
      return user;
    } else {
      return null; // Retorna null se o usuário não for encontrado
    }
  } catch (error) {
    throw new Error('Erro ao mudar o telefone do usuário');
  }
};

export { ChangeUserPhone };


const MakeAndSetCode = async (userId: number): Promise<User | null> => {
  try {
    const user = await User.findByPk(userId);
    if (user) {
      if (user.confirmedphone === 'true') {
        // Se confirmedphone for true, não faz nada e retorna o usuário
        return user;
      }

      if (user.confirmedphone && user.confirmedphone.length === 6) {
        // Se confirmedphone tem 6 dígitos, retorna o valor existente
        return user;
      }

      if (user.confirmedphone === null || user.confirmedphone === 'false') {
        // Gera um código de 6 dígitos aleatórios
        const generateCode = () => {
          return Math.floor(100000 + Math.random() * 900000).toString();
        };

        // Define o código gerado
        user.confirmedphone = generateCode();
        await user.save();
      }

      return user;
    } else {
      return null; // Retorna null se o usuário não for encontrado
    }
  } catch (error) {
    throw new Error('Erro ao definir token');
  }
};

export { MakeAndSetCode };


interface ConfirmCodeResult {
  status: number;
  message?: string;
}



const ConfirmCode = async (userId: number, code: string): Promise<ConfirmCodeResult> => {
  try {
    const user = await User.findByPk(userId);
    if (user) {
      if (user.confirmedphone === 'true') {
        return { status: 201, message: 'Essa conta já foi confirmada anteriormente' };
      }

      if (user.confirmedphone == null || user.confirmedphone == '') {
        return { status: 500, message: 'Não foi possível confirmar o código, entre em contato com um administrador' };
      }

      if (user.confirmedphone && user.confirmedphone.length === 6) {

        if (user.confirmedphone == code) {

          user.confirmedphone = 'true';
          user.save();

          return { status: 200, message: 'Telefone vinculado com sucesso' };

        } else {
          return { status: 300, message: 'Código incorreto' };
        }

      }

    } else {
      return { status: 404, message: 'Usuário não encontrado' };
    }
  } catch (error) {
    throw new Error('Erro ao definir token');
  }
};

export { ConfirmCode };



const setPhone = async (userId: number, phone: string): Promise<User | null> => {
  try {
    const user = await User.findByPk(userId);
    if (user) {
      user.phone = phone;
      await user.save();

      return user;

    }

  } catch (error) {
    throw new Error('Erro ao definir token');
  }
};

export { setPhone };


const verifyContact = async (phone: string): Promise<User | null> => {
  try {

    const numberExists = await User.findOne({
      where: { phone }
    });

    return numberExists;

  } catch (error) {
    throw new Error('Erroxxx');
  }
};

export { verifyContact };
