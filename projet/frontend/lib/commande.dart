import 'produit.dart';

class Commande {
  int id;
  List<Map<Produit, int>> produits = [];
  double total = 0.0;

  Commande(this.id);

  void ajouterProduit(Produit produit, int quantite) {
    if (produit.stock < quantite) {
      throw StockInsuffisantException(
          'Stock insuffisant pour le produit ${produit.nom}');
    }
    produits.add({produit: quantite});
    produit.stock -= quantite;
    calculerTotal();
  }

  void calculerTotal() {
    total = produits.fold(0, (sum, item) {
      var produit = item.keys.first;
      var quantite = item[produit]!;
      return sum + (produit.prix * quantite);
    });
  }

  void afficherCommande() {
    if (produits.isEmpty) {
      throw CommandeVideException('La commande est vide');
    }
    print('Commande ID: $id');
    produits.forEach((item) {
      var produit = item.keys.first;
      var quantite = item[produit]!;
      print(
          'Produit: ${produit.nom}, Quantité: $quantite, Prix Unitaire: ${produit.prix}');
    });
    print('Total: $total');
  }
}

class CommandeVideException implements Exception {
  String cause;
  CommandeVideException(this.cause);
}
