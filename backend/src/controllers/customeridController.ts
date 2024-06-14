import User from "../models/User";

const setCustomerID = async (userId: number, customer_id: string): Promise<User | null> => {
  try {
    
    const user = await User.findByPk(userId);
    if (user) {
      user.customer_id = customer_id;
      await user.save();
      return user;
    }

  } catch (error) {
    throw new Error('Erro salvar customer_id');
  }
};

export { setCustomerID };